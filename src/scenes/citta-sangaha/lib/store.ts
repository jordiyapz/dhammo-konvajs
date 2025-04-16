import { createStore } from "zustand/vanilla";
import { CittaSangahaState, CittaSangahaValues } from "./interface";
import { cittaIds } from "@/entities/citta";
import { cetasikaIdList, getCetasikaCombination } from "@/entities/cetasika";
import { subscribeWithSelector } from "zustand/middleware";

const initialState: CittaSangahaValues = {
  selectedCitta: null,
  selectedCetasika: null,
  cittaList: cittaIds,
  cetasikaList: cetasikaIdList,
  sometimeCetasikaList: [],
  activeCombination: [],
};

const store = createStore<CittaSangahaState>()(
  subscribeWithSelector((set) => ({
    ...initialState,
    selectCitta: (cittaId) =>
      set(() => {
        if (cittaId === null)
          return { selectedCitta: null, cetasikaList: cetasikaIdList };

        const combination = getCetasikaCombination(cittaId);
        if (!combination) return { selectedCitta: cittaId, cetasikaList: [] };

        const cetasikaList = combination.mustHave;
        const sometimeCetasikaList = combination.sometime;
        return { selectedCitta: cittaId, cetasikaList, sometimeCetasikaList };
      }),
  }))
);

export default store;
