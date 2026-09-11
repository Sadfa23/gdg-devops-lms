import { z } from "zod";

export const postInputSchema = z.object({
  title: z.string().min(1, "Every post needs a title."),
  kicker: z.string().optional(),
  deck: z.string().optional(),
  category: z.enum(["guide", "teardown", "career", "notes", "security"]).optional(),
  bannerPublicId: z.string().optional(),
});

export type PostInput = z.infer<typeof postInputSchema>;

export const updatePostMetaSchema = postInputSchema.extend({
  postId: z.string().uuid(),
});

/** Called directly from the client (not via a <form action>), so this
 * validates a plain object rather than FormData. */
export const updatePostContentSchema = z.object({
  postId: z.string().uuid(),
  content: z.string(),
});
