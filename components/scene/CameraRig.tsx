"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { Vector3 } from "three";
import { INTRO_DOORWAY, INTRO_START, OVERVIEW, SECTION_POSES, type CameraPose } from "@/lib/sceneConfig";
import { usePortfolioStore } from "@/lib/store";

/**
 * Owns the camera. GSAP tweens two vectors (position + look-at target);
 * useFrame applies them every frame with a little hand-held sway on top.
 */
export default function CameraRig() {
  const camera = useThree((s) => s.camera);
  const pos = useRef(new Vector3(...INTRO_START.position));
  const tgt = useRef(new Vector3(...INTRO_START.target));

  const phase = usePortfolioStore((s) => s.phase);
  const activeSection = usePortfolioStore((s) => s.activeSection);
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);
  const finishIntro = usePortfolioStore((s) => s.finishIntro);

  const tweenTo = (pose: CameraPose, duration: number, ease = "power2.inOut") => {
    gsap.to(pos.current, {
      x: pose.position[0],
      y: pose.position[1],
      z: pose.position[2],
      duration,
      ease,
      overwrite: "auto",
    });
    gsap.to(tgt.current, {
      x: pose.target[0],
      y: pose.target[1],
      z: pose.target[2],
      duration,
      ease,
      overwrite: "auto",
    });
  };

  // The slow walk down the corridor.
  useEffect(() => {
    if (phase !== "intro") return;
    if (reducedMotion) {
      pos.current.set(...OVERVIEW.position);
      tgt.current.set(...OVERVIEW.target);
      finishIntro();
      return;
    }
    const tl = gsap.timeline({ onComplete: finishIntro });
    tl.to(
      pos.current,
      {
        x: INTRO_DOORWAY.position[0],
        y: INTRO_DOORWAY.position[1],
        z: INTRO_DOORWAY.position[2],
        duration: 7,
        ease: "power1.inOut",
      },
      0
    )
      .to(
        tgt.current,
        {
          x: INTRO_DOORWAY.target[0],
          y: INTRO_DOORWAY.target[1],
          z: INTRO_DOORWAY.target[2],
          duration: 7,
          ease: "power1.inOut",
        },
        0
      )
      .to(
        pos.current,
        {
          x: OVERVIEW.position[0],
          y: OVERVIEW.position[1],
          z: OVERVIEW.position[2],
          duration: 3.2,
          ease: "power2.inOut",
        },
        ">-0.4"
      )
      .to(
        tgt.current,
        {
          x: OVERVIEW.target[0],
          y: OVERVIEW.target[1],
          z: OVERVIEW.target[2],
          duration: 3.2,
          ease: "power2.inOut",
        },
        "<"
      );
    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, reducedMotion]);

  // Focus moves + return to overview.
  useEffect(() => {
    const posVec = pos.current;
    const tgtVec = tgt.current;
    if (phase === "focus" && activeSection) {
      tweenTo(SECTION_POSES[activeSection], reducedMotion ? 0 : 1.3);
    } else if (phase === "explore") {
      tweenTo(OVERVIEW, reducedMotion ? 0 : 1.0);
    }
    return () => {
      gsap.killTweensOf([posVec, tgtVec]);
    };
  }, [phase, activeSection, reducedMotion]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    let ox = 0;
    let oy = 0;
    if (!reducedMotion) {
      if (phase === "intro") {
        // Footstep bob during the walk.
        ox = Math.sin(t * 1.9) * 0.03;
        oy = Math.abs(Math.sin(t * 2.6)) * 0.03;
      } else if (phase === "explore") {
        ox = Math.sin(t * 0.31) * 0.03;
        oy = Math.sin(t * 0.23) * 0.018;
      }
    }
    camera.position.set(pos.current.x + ox, pos.current.y + oy, pos.current.z);
    camera.lookAt(tgt.current);
  });

  return null;
}
