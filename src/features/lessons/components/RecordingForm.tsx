"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CloudinaryUploadButton } from "@/components/CloudinaryUploadButton";
import { BunnyUploadButton } from "@/components/BunnyUploadButton";
import { updateLessonRecording } from "../actions";

type RecordingFormProps = {
  lessonId: string;
  cloudName: string;
  apiKey: string;
  initial: {
    bunnyVideoId: string | null;
    videoPublicId: string | null;
    posterPublicId: string | null;
    captionsPublicId: string | null;
    transcript: string | null;
  };
};

/** `02 · THE RECORDING` + `05 · TERMINAL / CODE WALKTHROUGH`. New lessons go
 * through Bunny Stream (no upload size cap, see docs/ARCHITECTURE notes) —
 * that's the primary field. The Cloudinary video/poster fields stay for
 * editing lessons recorded before the switch; a lesson only ever plays from
 * one source, and the player prefers Bunny when both are somehow set. */
export function RecordingForm({ lessonId, cloudName, apiKey, initial }: RecordingFormProps) {
  const [state, formAction, pending] = useActionState(updateLessonRecording, undefined);
  const [bunnyVideoId, setBunnyVideoId] = useState(initial.bunnyVideoId ?? "");
  const [videoPublicId, setVideoPublicId] = useState(initial.videoPublicId ?? "");
  const [posterPublicId, setPosterPublicId] = useState(initial.posterPublicId ?? "");

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="lessonId" value={lessonId} />
      {state?.error && <p className="border-l-2 border-accent bg-accent-soft px-3 py-2 text-[13px] text-accent-ink">{state.error}</p>}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bunnyVideoId">Video (Bunny Stream)</Label>
        <div className="flex gap-2">
          <Input
            id="bunnyVideoId"
            name="bunnyVideoId"
            value={bunnyVideoId}
            onChange={(e) => setBunnyVideoId(e.target.value)}
            placeholder="Video GUID — filled in automatically after upload"
          />
          <BunnyUploadButton label="Upload" onUploaded={setBunnyVideoId} />
        </div>
      </div>

      <details className="group">
        <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
          Legacy Cloudinary video (older lessons only)
        </summary>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="videoPublicId">Video source</Label>
            <div className="flex gap-2">
              <Input id="videoPublicId" name="videoPublicId" value={videoPublicId} onChange={(e) => setVideoPublicId(e.target.value)} />
              <CloudinaryUploadButton
                cloudName={cloudName}
                apiKey={apiKey}
                resourceType="video"
                folder="lessons"
                label="Upload"
                onUploaded={setVideoPublicId}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="posterPublicId">Poster</Label>
            <div className="flex gap-2">
              <Input id="posterPublicId" name="posterPublicId" value={posterPublicId} onChange={(e) => setPosterPublicId(e.target.value)} />
              <CloudinaryUploadButton
                cloudName={cloudName}
                apiKey={apiKey}
                resourceType="image"
                folder="lessons"
                label="Upload"
                onUploaded={setPosterPublicId}
              />
            </div>
          </div>
        </div>
      </details>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="captionsPublicId">Captions (Cloudinary public ID, optional)</Label>
        <Input id="captionsPublicId" name="captionsPublicId" defaultValue={initial.captionsPublicId ?? ""} placeholder="lessons/04-10-captions" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="transcript">Terminal / code walkthrough</Label>
        <Textarea
          id="transcript"
          name="transcript"
          defaultValue={initial.transcript ?? ""}
          className="min-h-36 font-mono text-[12.5px]"
          placeholder="$ paste the commands the lesson runs on screen"
        />
      </div>

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
