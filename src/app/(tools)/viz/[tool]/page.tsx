import { notFound } from "next/navigation";
import { env } from "@/lib/env";

const TOOLS = {
  terraform: "Terraform graph",
  actions: "Actions workflow",
  k8s: "K8s manifests",
} as const;

type ToolSlug = keyof typeof TOOLS;

function isToolSlug(value: string): value is ToolSlug {
  return value in TOOLS;
}

/**
 * The integration seam decided early on: Topograph stays a fully separate
 * deployable (its own repo, its own Vercel project, no shared code, no auth
 * of its own) and the LMS just points an iframe at it. Nothing more
 * sophisticated than that yet — no postMessage for initialInput/onGraph,
 * since nothing has asked for a lesson to preload a specific config or for
 * the LMS to react to what gets drawn. Add that later if a lesson actually
 * needs it.
 */
export default async function VizToolPage({ params }: PageProps<"/viz/[tool]">) {
  const { tool } = await params;
  if (!isToolSlug(tool)) notFound();

  return !env.NEXT_PUBLIC_TOPOGRAPH_URL ? (
    <div className="flex h-full items-center justify-center">
      <p className="text-[13px] text-muted">Topograph isn&apos;t deployed yet — set NEXT_PUBLIC_TOPOGRAPH_URL once it is.</p>
    </div>
  ) : (
    <iframe
      src={`${env.NEXT_PUBLIC_TOPOGRAPH_URL.replace(/\/$/, "")}/app/${tool}`}
      title={TOOLS[tool]}
      className="h-full w-full border-0"
    />
  );
}
