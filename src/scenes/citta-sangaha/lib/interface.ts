import { CetasikaID } from "@/entities/cetasika";
import { CittaID } from "@/entities/citta";

export interface CittaSangahaValues {
  selectedCitta: CittaID | null;
  selectedCetasika: CetasikaID | null;
  cittaList: CittaID[];
  cetasikaList: CetasikaID[];
  sometimeCetasikaList: CetasikaID[];
  activeCombination: CetasikaID[];
}

export type CittaSangahaAction = {
  selectCitta(CittaId: CittaID|null): void;
};

export type CittaSangahaState = CittaSangahaValues & CittaSangahaAction;
