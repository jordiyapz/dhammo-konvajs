import { CetasikaID } from "@/entities/cetasika";
import { CittaID, UVedana } from "@/entities/citta";

export interface CittaSangahaValues {
  selectedCitta: CittaID | null;
  selectedCetasika: CetasikaID | null;
  cittaList: CittaID[];
  cetasikaList: CetasikaID[];
  sometimeCetasikaList: CetasikaID[];
  activeCombinationIndex: number | null;
  vedana: UVedana;
}

export type CittaSangahaAction = {
  selectCitta(cittaId: CittaID | null): void;
  selectCetasika(cetasikaId: CetasikaID | null): void;
  setCombination(index: number | null): void;
};

export type CittaSangahaState = CittaSangahaValues & CittaSangahaAction;
