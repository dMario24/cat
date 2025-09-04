'use client'

import dynamic from "next/dynamic";

const GtmScript = dynamic(() => import("@/components/GtmScript"), {
  ssr: false,
});

export default function GtmScriptLoader() {
  return <GtmScript />;
}
