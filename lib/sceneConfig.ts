import type { SectionId } from "@/content/types";

/**
 * Central layout + camera configuration for the 3D office.
 * All positions are in meters; the desk sits near the origin and the
 * corridor extends toward +Z.
 */

type Vec3 = [number, number, number];

export interface CameraPose {
  position: Vec3;
  target: Vec3;
}

/** Where the intro starts (far end of the corridor). */
export const INTRO_START: CameraPose = {
  position: [0, 1.55, 16],
  target: [0, 1.35, 0],
};

/** Mid-corridor beat, at the doorway into the office. */
export const INTRO_DOORWAY: CameraPose = {
  position: [0, 1.55, 4.6],
  target: [0, 1.2, -1],
};

/** Default over-the-shoulder view of the cubicle. */
export const OVERVIEW: CameraPose = {
  position: [1.55, 1.8, 1.7],
  target: [-0.1, 0.95, -1.2],
};

/** Per-section camera poses used when an object is clicked. */
export const SECTION_POSES: Record<SectionId, CameraPose> = {
  about: { position: [0, 1.18, -0.25], target: [0, 1.02, -1.45] },
  skills: { position: [0, 1.5, -0.35], target: [0, 0.76, -1.05] },
  resume: { position: [0.55, 1.45, -0.4], target: [0.58, 0.75, -1.0] },
  experience: { position: [-0.55, 1.4, -0.3], target: [-1.32, 0.6, -1.5] },
  projects: { position: [0.78, 1.3, -0.7], target: [0.8, 0.82, -1.38] },
  contact: { position: [-0.62, 1.35, -0.55], target: [-0.62, 0.8, -1.32] },
  timeline: { position: [0.7, 1.3, -0.75], target: [0.72, 1.28, -1.85] },
  blog: { position: [-2.4, 1.65, -2.1], target: [-2.4, 1.75, -4.0] },
  certifications: { position: [-0.35, 1.25, -0.45], target: [-0.38, 0.75, -0.98] },
};

/** Room shell */
export const ROOM = {
  width: 10, // x
  depth: 8, // z: -4 .. 4
  height: 3,
};

export const CORRIDOR = {
  width: 2.6,
  height: 2.7,
  zStart: 4, // shares the office wall
  zEnd: 18,
};
