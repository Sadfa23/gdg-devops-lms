import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "devops-calendar": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & { src?: string; today?: string };
    }
  }
}
