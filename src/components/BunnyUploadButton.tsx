"use client";

import { useRef, useState } from "react";
import * as tus from "tus-js-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BunnyUploadButtonProps = {
  onUploaded: (videoId: string) => void;
  label?: string;
  className?: string;
};

/**
 * Bunny Stream has no hosted widget like Cloudinary's, so this drives a
 * plain file input + tus-js-client directly: the video bytes go straight
 * from the browser to Bunny over a resumable TUS upload (no size cap, holds
 * up over flaky connections), while our server only ever handles the tiny
 * "create video + sign this upload" handshake in /api/bunny/create-upload —
 * the API key never reaches the browser.
 */
export function BunnyUploadButton({ onUploaded, label = "Upload video", className }: BunnyUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);

  async function handleFile(file: File) {
    setProgress(0);
    try {
      const res = await fetch("/api/bunny/create-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: file.name }),
      });
      if (!res.ok) throw new Error("Couldn't start the upload.");
      const { videoId, libraryId, signature, expiration } = await res.json();

      const upload = new tus.Upload(file, {
        endpoint: "https://video.bunnycdn.com/tusupload",
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          AuthorizationSignature: signature,
          AuthorizationExpire: String(expiration),
          VideoId: videoId,
          LibraryId: String(libraryId),
        },
        metadata: { filetype: file.type, title: file.name },
        onError: () => {
          toast.error("Video upload failed — check your connection and try again.");
          setProgress(null);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          setProgress(Math.round((bytesUploaded / bytesTotal) * 100));
        },
        onSuccess: () => {
          setProgress(null);
          onUploaded(videoId);
          toast.success("Video uploaded.");
        },
      });
      upload.start();
    } catch {
      toast.error("Couldn't start the upload.");
      setProgress(null);
    }
  }

  return (
    <div className="flex items-center gap-2.5">
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) handleFile(file);
        }}
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={progress !== null}
        className={cn(className)}
        onClick={() => inputRef.current?.click()}
      >
        {progress !== null ? `Uploading… ${progress}%` : label}
      </Button>
    </div>
  );
}
