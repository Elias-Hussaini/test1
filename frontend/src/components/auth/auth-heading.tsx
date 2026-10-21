import type { ReactNode } from "react";

export function AuthHeading({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="text-center">
      <h1 className="text-[1.45rem] font-black leading-snug tracking-tight">{title}</h1>
      {children ? <p className="mx-auto mt-2 max-w-[22rem] text-sm leading-7 text-muted">{children}</p> : null}
    </div>
  );
}
