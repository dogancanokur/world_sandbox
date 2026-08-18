import { SiteHeader } from "@/components/site-header";
import * as React from "react";
import WorldSandbox from "@/app/lab/world-sandbox/WorldSandbox";

export default function WorldSandboxView() {
  return (
    <>
      <SiteHeader title={"WorldSandbox"} />
      <WorldSandbox />
    </>
  );
}
