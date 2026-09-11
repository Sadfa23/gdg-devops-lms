/**
 * Public delivery for v1 (product decision — see docs/ARCHITECTURE notes):
 * plain unsigned URLs, no expiry, no enrollment check on the asset itself.
 *
 * `cloudName` is a required parameter here rather than read from `env`
 * internally — these functions are called from both Server Components and
 * Client Components (block/media previews in the editors), and importing
 * the shared `env` module (which validates every server secret at import
 * time) from a client-rendered file pulls that whole validation into the
 * browser bundle, where the secrets obviously aren't present — it throws a
 * ZodError the moment the module loads. Callers already have the cloud name
 * on hand either way: Server Components read it from `env`, Client
 * Components already receive it as a prop for the upload widget.
 */
export function cloudinaryImageUrl(cloudName: string, publicId: string, transform = "f_auto,q_auto"): string {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${publicId}`;
}

export function cloudinaryVideoUrl(cloudName: string, publicId: string, transform = "f_auto,q_auto"): string {
  return `https://res.cloudinary.com/${cloudName}/video/upload/${transform}/${publicId}`;
}
