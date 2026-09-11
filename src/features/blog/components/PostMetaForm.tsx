"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CloudinaryUploadButton } from "@/components/CloudinaryUploadButton";
import { cloudinaryImageUrl } from "@/lib/cloudinary";
import { updatePostMeta } from "../actions";
import type { Post } from "@/generated/prisma/client";

const CATEGORIES = ["guide", "teardown", "career", "notes", "security"] as const;

type PostMetaFormProps = {
  post: Pick<Post, "id" | "title" | "kicker" | "deck" | "category" | "bannerPublicId">;
  cloudName: string;
  apiKey: string;
};

/**
 * Every field saves on blur (or immediately, for the banner/category
 * pickers) — no separate "save" button, matching the rest of the editor's
 * continuous-document feel rather than a form you submit once.
 */
export function PostMetaForm({ post, cloudName, apiKey }: PostMetaFormProps) {
  const [bannerPublicId, setBannerPublicId] = useState(post.bannerPublicId);
  const [pending, startTransition] = useTransition();

  function save(field: string, value: string) {
    startTransition(async () => {
      try {
        await updatePostMeta({
          postId: post.id,
          title: post.title,
          kicker: post.kicker ?? undefined,
          deck: post.deck ?? undefined,
          category: post.category ?? undefined,
          bannerPublicId: post.bannerPublicId ?? undefined,
          [field]: value,
        });
      } catch {
        toast.error("Couldn't save that change.");
      }
    });
  }

  return (
    <div className="mb-8 flex flex-col gap-5 border border-line bg-surface p-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="meta-title">Title</Label>
        <Input id="meta-title" defaultValue={post.title} onBlur={(e) => save("title", e.target.value)} className="text-[18px] font-bold" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="meta-kicker">Kicker</Label>
        <Input id="meta-kicker" defaultValue={post.kicker ?? ""} onBlur={(e) => save("kicker", e.target.value)} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="meta-deck">Deck</Label>
        <Textarea id="meta-deck" defaultValue={post.deck ?? ""} onBlur={(e) => save("deck", e.target.value)} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="meta-category">Category</Label>
        <select
          id="meta-category"
          defaultValue={post.category ?? "guide"}
          onChange={(e) => save("category", e.target.value)}
          className="h-10 w-full max-w-[220px] border border-line bg-transparent px-3 font-sans text-[14px] text-ink outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-surface text-ink">
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Banner image</Label>
        {bannerPublicId && (
          // eslint-disable-next-line @next/next/no-img-element -- Cloudinary-hosted, arbitrary aspect ratio
          <img src={cloudinaryImageUrl(cloudName, bannerPublicId)} alt="" className="mb-2 h-32 w-full max-w-sm object-cover" />
        )}
        <CloudinaryUploadButton
          cloudName={cloudName}
          apiKey={apiKey}
          resourceType="image"
          folder="blog"
          label={bannerPublicId ? "Replace banner" : "Upload banner"}
          className="w-fit"
          onUploaded={(publicId) => {
            setBannerPublicId(publicId);
            save("bannerPublicId", publicId);
          }}
        />
      </div>

      {pending && <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">Saving…</p>}
    </div>
  );
}
