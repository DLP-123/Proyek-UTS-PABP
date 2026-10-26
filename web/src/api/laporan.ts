import { request } from "./client";
import type { Laporan } from "../types";

export function getLaporan(): Promise<Laporan[]> {
  return request<Laporan[]>("/laporan");
}