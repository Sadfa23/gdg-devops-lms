/** Verbatim from design_handoff_gdg_devops_lms/content-data.md — "Pipeline stages". */
export type PipelineStage = {
  n: string;
  label: string;
  title: string;
  file: string;
  body: string;
  bullets: string[];
  cta: string;
  code: string;
  leftLabels: string[];
  rightLabels: string[];
  image: string;
};

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    n: "01",
    label: "SOURCE",
    title: "Source of truth",
    file: "git log --oneline",
    body: "Every lab starts as a branch on the club org. Conventional commits, protected main, review from a track mentor.",
    bullets: ["Branch naming and commit hygiene", "PR templates the mentors actually read", "Signed tags for graded releases"],
    cta: "OPEN MODULE 01",
    code: `a41c2e9 feat(api): add readiness probe\n7d3b110 fix(ci): cache layer for node_modules\n2f9ac04 chore: pin trivy to 0.54\n1b7e455 feat: blue-green switch script`,
    leftLabels: ["BRANCHES", "PULL REQUESTS", "REVIEWS", "PROTECTED MAIN"],
    rightLabels: ["CONVENTIONAL COMMITS", "SIGNED TAGS", "CODEOWNERS", "ISSUE LINKS"],
    image: "/images/pipeline/01-source.png",
  },
  {
    n: "02",
    label: "BUILD",
    title: "Reproducible builds",
    file: "Dockerfile",
    body: "One image, built once, promoted everywhere. Multi-stage builds, cached layers, and a size budget you have to defend.",
    bullets: ["Multi-stage Dockerfiles under 120MB", "Layer caching in CI", "SBOM generated on every build"],
    cta: "OPEN MODULE 02",
    code: `FROM node:20-alpine AS build\nWORKDIR /src\nRUN --mount=type=cache,target=/root/.npm \\\n    npm ci --omit=dev\nFROM gcr.io/distroless/nodejs20\nCOPY --from=build /src /app`,
    leftLabels: ["MULTI-STAGE", "LAYER CACHE", "SBOM", "IMAGE BUDGET"],
    rightLabels: ["REGISTRY PUSH", "DIGEST PINNING", "PROVENANCE", "SIZE REPORT"],
    image: "/images/pipeline/02-build.png",
  },
  {
    n: "03",
    label: "TEST & SCAN",
    title: "Fail fast, fail loud",
    file: "ci.test.yml",
    body: "Unit tests, integration tests against ephemeral containers, and a scan gate that blocks the merge — not a warning nobody reads.",
    bullets: ["Testcontainers for real dependencies", "Coverage gate at 70%", "Trivy + gitleaks as blocking checks"],
    cta: "OPEN MODULE 03",
    code: `- run: npm test -- --coverage\n- run: trivy image --exit-code 1 \\\n    --severity HIGH,CRITICAL lab04\n- run: gitleaks detect --no-banner`,
    leftLabels: ["UNIT", "INTEGRATION", "CONTRACT", "SMOKE"],
    rightLabels: ["SECRET SCAN", "CVE GATE", "COVERAGE", "FLAKE REPORT"],
    image: "/images/pipeline/03-test-scan.png",
  },
  {
    n: "04",
    label: "DEPLOY",
    title: "Deploys that can be undone",
    file: "switch.sh",
    body: "Blue-green and canary on hardware you can afford — a droplet, a proxy and a health check that tells the truth.",
    bullets: ["Blue-green with a single reverse proxy", "Readiness vs liveness, properly", "One-command rollback drill"],
    cta: "OPEN MODULE 04",
    code: `docker compose up -d api-green\nuntil curl -fs localhost:8081/ready; do sleep 1; done\nnginx -s reload   # traffic -> green\ndocker compose stop api-blue`,
    leftLabels: ["BLUE-GREEN", "CANARY", "ROLLBACK", "DRAIN"],
    rightLabels: ["HEALTH CHECKS", "PROXY RELOAD", "MIGRATIONS", "FEATURE FLAGS"],
    image: "/images/pipeline/04-deploy.png",
  },
  {
    n: "05",
    label: "OBSERVE",
    title: "Know before the users do",
    file: "alerts.yml",
    body: "Metrics, logs and traces wired into one board, with alerts written as sentences a sleepy student can act on.",
    bullets: ["Golden signals on one dashboard", "SLOs and an error budget", "Runbook links inside every alert"],
    cta: "OPEN MODULE 05",
    code: `- alert: CheckoutLatencyBudgetBurn\n  expr: slo:latency:burn_rate5m > 6\n  for: 10m\n  annotations:\n    runbook: https://gdg.jkuat/runbooks/latency`,
    leftLabels: ["METRICS", "LOGS", "TRACES", "DASHBOARDS"],
    rightLabels: ["SLOS", "ERROR BUDGET", "ON-CALL", "POSTMORTEM"],
    image: "/images/pipeline/05-observe.png",
  },
];
