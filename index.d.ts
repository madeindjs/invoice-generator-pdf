import type { InvoiceData } from "./model.d.ts";

export function exportToPDF(data: InvoiceData, path: string): Promise<void>;
