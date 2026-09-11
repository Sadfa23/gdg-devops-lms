"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CloudinaryUploadButtonProps = {
  cloudName: string;
  apiKey: string;
  resourceType: "image" | "video";
  folder: string;
  onUploaded: (publicId: string) => void;
  label?: string;
  className?: string;
};

/**
 * Opens Cloudinary's own hosted upload widget (drag-drop, browse, or paste a
 * URL) and hands back just the Public ID once the file lands — nothing is
 * proxied through our server, and no manual trip to the Cloudinary dashboard
 * is needed. Signed via /api/cloudinary/sign (admin-gated) rather than an
 * unsigned upload preset, so there's no separate Cloudinary console setup.
 */
export function CloudinaryUploadButton({
  cloudName,
  apiKey,
  resourceType,
  folder,
  onUploaded,
  label,
  className,
}: CloudinaryUploadButtonProps) {
  return (
    <CldUploadWidget
      signatureEndpoint="/api/cloudinary/sign"
      config={{ cloud: { cloudName, apiKey } }}
      options={{ sources: ["local", "url", "camera"], resourceType, folder, multiple: false }}
      onSuccess={(result) => {
        const info = result.info;
        if (info && typeof info === "object" && "public_id" in info) {
          onUploaded(info.public_id);
        }
      }}
    >
      {({ open, isLoading }) => (
        <Button type="button" variant="secondary" size="sm" disabled={isLoading} className={cn(className)} onClick={() => open()}>
          {isLoading ? "Loading uploader…" : (label ?? `Upload ${resourceType}`)}
        </Button>
      )}
    </CldUploadWidget>
  );
}
