import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type * as React from "react";
import { DashboardShell } from "../../components/DashboardShell";
import { isPersonaId, PERSONA_CONFIGS, type PersonaId } from "../../specs/personas";

interface PersonaPageProps {
  params: Promise<{ persona: string }>;
}

export function generateStaticParams(): Array<{ persona: PersonaId }> {
  return [{ persona: "novice" }, { persona: "senior" }, { persona: "manager" }];
}

export async function generateMetadata({
  params,
}: PersonaPageProps): Promise<Metadata> {
  const { persona } = await params;
  if (!isPersonaId(persona)) {
    return { title: "Persona Not Found | Anchor" };
  }
  const config = PERSONA_CONFIGS[persona];
  return {
    title: `${config.label} | Anchor Support Desk`,
    description: config.description,
  };
}

export default async function PersonaPage({
  params,
}: PersonaPageProps): Promise<React.JSX.Element> {
  const { persona } = await params;
  if (!isPersonaId(persona)) {
    notFound();
  }

  return <DashboardShell persona={PERSONA_CONFIGS[persona]} />;
}
