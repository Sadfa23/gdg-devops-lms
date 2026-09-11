/**
 * Public delivery, no token authentication (matches the same v1 scope call
 * already made for Cloudinary — see docs/ARCHITECTURE notes): anyone with
 * the URL can watch. `libraryId`/`cdnHostname` are required params rather
 * than read from `env` internally, same reasoning as lib/cloudinary.ts —
 * these are called from Client Components too, and importing the shared
 * `env` module (which validates every server secret) into client code
 * throws a ZodError in the browser bundle.
 */
export function bunnyEmbedUrl(libraryId: string, videoId: string): string {
  return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false`;
}

export function bunnyThumbnailUrl(cdnHostname: string, videoId: string): string {
  return `https://${cdnHostname}/${videoId}/thumbnail.jpg`;
}
