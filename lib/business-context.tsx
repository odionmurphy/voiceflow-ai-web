"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Business } from "./types";
import { listBusinesses } from "./business-api";
import { useAuth } from "./auth-context";

interface BusinessContextValue {
  businesses: Business[];
  activeBusiness: Business | null;
  loading: boolean;
  refresh: () => Promise<void>;
  setActiveBusinessId: (id: string) => void;
}

const BusinessContext = createContext<BusinessContextValue | undefined>(undefined);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBusinessId, setActiveBusinessId] = useState<string | null>(null);

  async function refresh() {
    if (!user) return;
    setLoading(true);
    try {
      const list = await listBusinesses();
      setBusinesses(list);
      setActiveBusinessId((current) => {
        if (current && list.some((b) => b.id === current)) return current;
        return list[0]?.id ?? null;
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) refresh();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const activeBusiness = useMemo(
    () => businesses.find((b) => b.id === activeBusinessId) ?? businesses[0] ?? null,
    [businesses, activeBusinessId]
  );

  return (
    <BusinessContext.Provider
      value={{ businesses, activeBusiness, loading, refresh, setActiveBusinessId }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error("useBusiness must be used within BusinessProvider");
  return ctx;
}
