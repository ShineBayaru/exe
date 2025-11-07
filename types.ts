// FIX: Define and export the GlossaryTerm interface. This file should only contain type definitions.
export interface GlossaryTerm {
  id: number;
  term: string;
  reading: string;
  alias: string;
  english: string;
  meaning: string;
  categories: string[];
  notes: string;
  author: string;
  dateAdded: string;
  updater?: string;
  dateUpdated?: string;
  imageUrl?: string;
}
