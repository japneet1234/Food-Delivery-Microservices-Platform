"use client";

import { useEffect, useState } from "react";

export type Address = {
  id: string;
  label: string;
  address: string;
};

const STORAGE_KEY = "foodie_saved_addresses";
const DEFAULT_ADDRESSES: Address[] = [
  { id: "home", label: "Home", address: "HSR Layout, Bangalore" },
  { id: "work", label: "Work", address: "Koramangala, Bangalore" },
];

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: Address[] = raw ? JSON.parse(raw) : DEFAULT_ADDRESSES;
      setAddresses(parsed);
      if (parsed.length) setSelectedId(parsed[0].id);
    } catch {
      setAddresses(DEFAULT_ADDRESSES);
      setSelectedId(DEFAULT_ADDRESSES[0].id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  const addAddress = (label: string, address: string) => {
    const id = `${label.toLowerCase()}-${Date.now()}`;
    const newAddr: Address = { id, label, address };
    setAddresses((prev) => [newAddr, ...prev]);
    setSelectedId(id);
    return newAddr;
  };

  const selectAddress = (id: string) => setSelectedId(id);

  const selected = addresses.find((a) => a.id === selectedId) || null;

  return { addresses, selected, addAddress, selectAddress };
}
