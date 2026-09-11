"use client";

import { Button } from "@/components/ui/button";
import { deletePost } from "../actions";

/**
 * A plain `<form action>` (not a client-side call wrapped in try/catch) so
 * `deletePost`'s `redirect()` reaches the router untouched — catching around
 * a direct call would also catch Next's redirect signal and misreport it as
 * a failure. `onSubmit` only gates whether the form submits at all.
 */
export function DeletePostButton({ postId, title }: { postId: string; title: string }) {
  return (
    <form
      action={deletePost.bind(null, postId)}
      onSubmit={(e) => {
        if (!confirm(`Delete "${title}"? This can't be undone.`)) e.preventDefault();
      }}
    >
      <Button type="submit" variant="destructive" size="sm">
        Delete
      </Button>
    </form>
  );
}
