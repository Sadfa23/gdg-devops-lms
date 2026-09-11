/**
 * Curriculum seed — the six modules from content-data.md ("Modules
 * (lesson-builder select options)"). Doesn't touch users/lessons/posts:
 * those all need a real signed-in admin to exist first (Post.authorId,
 * Lesson.createdById), which this script has no way to fabricate honestly.
 * Run with: npx prisma db seed
 */
import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

config({ quiet: true });

// Plain TCP via `pg`, same as src/lib/db.ts uses outside Vercel — the Neon
// WebSocket driver this used previously was unreliable in local Node
// scripts (see db.ts's comment); this one connection doesn't need to be
// serverless-friendly at all, it's a one-shot script.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

const MODULES = [
  { number: 1, title: "Version control at team scale" },
  { number: 2, title: "Containers and reproducible builds" },
  { number: 3, title: "Pipelines, tests and scan gates" },
  { number: 4, title: "Deploy and release strategy" },
  { number: 5, title: "Observability and on-call" },
  { number: 6, title: "Cloud, cost and the capstone" },
];

// content-data.md "Submissions" — the two BONUS rows share a display label
// there, but Lab.code is unique, so they're distinguished here.
const LABS = [
  { code: "LAB 01", moduleNumber: 1, title: "Trunk-based workflow with protected main" },
  { code: "LAB 02", moduleNumber: 2, title: "Distroless image under 90MB" },
  { code: "LAB 03", moduleNumber: 3, title: "Blocking CVE gate in the build pipeline" },
  { code: "LAB 04", moduleNumber: 4, title: "Zero-downtime deploy on a 2-node swarm" },
  { code: "BONUS-IAC", moduleNumber: null, title: "Terraform module for the club droplet" },
  { code: "BONUS-OBS", moduleNumber: null, title: "Grafana board for the events API" },
];

async function main() {
  // No unique constraint on `number` by design (see schema.prisma's comment
  // on Module.number) — so this is a manual find-or-create, not an upsert.
  let modulesCreated = 0;
  const moduleIdByNumber = new Map<number, string>();
  for (const [i, m] of MODULES.entries()) {
    const existing = await db.module.findFirst({ where: { number: m.number } });
    if (existing) {
      moduleIdByNumber.set(m.number, existing.id);
      continue;
    }
    const created = await db.module.create({ data: { number: m.number, title: m.title, position: i } });
    moduleIdByNumber.set(m.number, created.id);
    modulesCreated += 1;
  }
  console.log(`Seeded ${modulesCreated} new module(s), ${MODULES.length - modulesCreated} already existed.`);

  let labsCreated = 0;
  for (const l of LABS) {
    const existing = await db.lab.findUnique({ where: { code: l.code } });
    if (existing) continue;
    await db.lab.create({
      data: { code: l.code, title: l.title, moduleId: l.moduleNumber ? moduleIdByNumber.get(l.moduleNumber) : null },
    });
    labsCreated += 1;
  }
  console.log(`Seeded ${labsCreated} new lab(s), ${LABS.length - labsCreated} already existed.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
