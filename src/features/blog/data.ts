import { db } from "@/lib/db";

export function listPublishedPosts(limit?: number) {
  return db.post.findMany({
    where: { status: "live" },
    include: { author: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export function getPostBySlug(slug: string) {
  return db.post.findUnique({
    where: { slug },
    include: { author: true },
  });
}

export function listAllPostsForAdmin() {
  return db.post.findMany({ include: { author: true }, orderBy: { createdAt: "desc" } });
}

export function getPostForEdit(id: string) {
  return db.post.findUnique({ where: { id } });
}
