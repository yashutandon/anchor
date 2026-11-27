"use client";

import * as React from "react";
import type { SupportTicket } from "./types";

export interface SpecRenderContextValue {
  tickets: readonly SupportTicket[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  selectedTicketId: string | null;
  setSelectedTicketId: (id: string | null) => void;
  lastActionMessage: string | null;
  notifyAction: (message: string) => void;
}

const SpecRenderContext = React.createContext<SpecRenderContextValue | null>(null);

export interface SpecRenderProviderProps {
  initialTickets: readonly SupportTicket[];
  children: React.ReactNode;
}

export function SpecRenderProvider({
  initialTickets,
  children,
}: SpecRenderProviderProps): React.JSX.Element {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [selectedTicketId, setSelectedTicketId] = React.useState<string | null>(
    initialTickets[0]?.id ?? null,
  );
  const [lastActionMessage, setLastActionMessage] = React.useState<string | null>(null);

  const value = React.useMemo<SpecRenderContextValue>(
    () => ({
      tickets: initialTickets,
      searchQuery,
      setSearchQuery,
      statusFilter,
      setStatusFilter,
      selectedTicketId,
      setSelectedTicketId,
      lastActionMessage,
      notifyAction: setLastActionMessage,
    }),
    [initialTickets, searchQuery, statusFilter, selectedTicketId, lastActionMessage],
  );

  return (
    <SpecRenderContext.Provider value={value}>{children}</SpecRenderContext.Provider>
  );
}

export function useSpecRenderContext(): SpecRenderContextValue | null {
  return React.useContext(SpecRenderContext);
}
