import { describe, it, expect } from "vitest";
import {
  listPublishedPosts,
  getPublishedPostBySlug,
  listAllPosts,
  getPostById,
  listTakenSlugs,
  createPost,
  updatePost,
  deletePost,
} from "@/lib/blog/posts";

type Cfg = { result?: unknown; single?: unknown };

/** Minimal fake of the Supabase fluent query builder that records calls. */
function makeFakeDb(cfg: Cfg) {
  const calls: Array<[string, unknown[]]> = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const builder: any = {};
  const chain =
    (name: string) =>
    (...args: unknown[]) => {
      calls.push([name, args]);
      return builder;
    };
  for (const m of ["select", "eq", "contains", "order", "insert", "update", "delete"]) {
    builder[m] = chain(m);
  }
  builder.single = (...a: unknown[]) => {
    calls.push(["single", a]);
    return Promise.resolve(cfg.single ?? cfg.result);
  };
  builder.maybeSingle = (...a: unknown[]) => {
    calls.push(["maybeSingle", a]);
    return Promise.resolve(cfg.single ?? cfg.result);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  builder.then = (onF: any, onR: any) => Promise.resolve(cfg.result).then(onF, onR);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db: any = {
    from: (...a: unknown[]) => {
      calls.push(["from", a]);
      return builder;
    },
    _calls: calls,
  };
  return db;
}

describe("listPublishedPosts", () => {
  it("filters to published and orders by published_at desc", async () => {
    const rows = [{ id: "1", status: "published" }];
    const db = makeFakeDb({ result: { data: rows, error: null } });
    const out = await listPublishedPosts(db);
    expect(out).toEqual(rows);
    expect(db._calls).toEqual(
      expect.arrayContaining([
        ["eq", ["status", "published"]],
        ["order", ["published_at", { ascending: false }]],
      ]),
    );
  });

  it("filters by tag when provided", async () => {
    const db = makeFakeDb({ result: { data: [], error: null } });
    await listPublishedPosts(db, { tag: "travel" });
    expect(db._calls).toEqual(
      expect.arrayContaining([["contains", ["tags", ["travel"]]]]),
    );
  });

  it("throws on a database error", async () => {
    const db = makeFakeDb({ result: { data: null, error: { message: "boom" } } });
    await expect(listPublishedPosts(db)).rejects.toThrow(/boom/);
  });
});

describe("getPublishedPostBySlug", () => {
  it("returns null when not found", async () => {
    const db = makeFakeDb({ single: { data: null, error: null } });
    expect(await getPublishedPostBySlug(db, "nope")).toBeNull();
  });

  it("returns the row and filters by slug + published", async () => {
    const row = { id: "1", slug: "x" };
    const db = makeFakeDb({ single: { data: row, error: null } });
    expect(await getPublishedPostBySlug(db, "x")).toEqual(row);
    expect(db._calls).toEqual(
      expect.arrayContaining([
        ["eq", ["slug", "x"]],
        ["eq", ["status", "published"]],
      ]),
    );
  });
});

describe("admin reads", () => {
  it("listAllPosts orders by updated_at desc and includes drafts", async () => {
    const rows = [{ id: "1", status: "draft" }];
    const db = makeFakeDb({ result: { data: rows, error: null } });
    expect(await listAllPosts(db)).toEqual(rows);
    expect(db._calls).toEqual(
      expect.arrayContaining([["order", ["updated_at", { ascending: false }]]]),
    );
  });

  it("getPostById returns the row", async () => {
    const row = { id: "42" };
    const db = makeFakeDb({ single: { data: row, error: null } });
    expect(await getPostById(db, "42")).toEqual(row);
  });

  it("listTakenSlugs maps rows to slug strings", async () => {
    const db = makeFakeDb({
      result: { data: [{ slug: "a" }, { slug: "b" }], error: null },
    });
    expect(await listTakenSlugs(db)).toEqual(["a", "b"]);
  });
});

describe("mutations", () => {
  it("createPost returns the inserted row", async () => {
    const row = { id: "1", title: "t" };
    const db = makeFakeDb({ single: { data: row, error: null } });
    expect(await createPost(db, { title: "t", slug: "s" })).toEqual(row);
  });

  it("createPost throws on error", async () => {
    const db = makeFakeDb({ single: { data: null, error: { message: "nope" } } });
    await expect(createPost(db, { title: "t", slug: "s" })).rejects.toThrow(/nope/);
  });

  it("updatePost returns the updated row and filters by id", async () => {
    const row = { id: "9", title: "u" };
    const db = makeFakeDb({ single: { data: row, error: null } });
    expect(await updatePost(db, "9", { title: "u" })).toEqual(row);
    expect(db._calls).toEqual(expect.arrayContaining([["eq", ["id", "9"]]]));
  });

  it("deletePost throws on error", async () => {
    const db = makeFakeDb({ result: { error: { message: "del" } } });
    await expect(deletePost(db, "1")).rejects.toThrow(/del/);
  });
});
