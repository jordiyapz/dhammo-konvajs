import { createStore } from "zustand/vanilla";
import { subscribeWithSelector } from "zustand/middleware";

import { cittaIdList, getCittaCombination } from "@/entities/citta";
import { cetasikaIdList } from "@/entities/cetasika";
import { CittaSangahaState, CittaSangahaValues } from "./interface";

const initialState: CittaSangahaValues = {
  selectedCitta: null,
  selectedCetasika: null,
  cittaList: cittaIdList,
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

        const combination = getCittaCombination(cittaId);
        if (!combination) return { selectedCitta: cittaId, cetasikaList: [] };

        const cetasikaList = combination.mustHave;
        const sometimeCetasikaList = combination.sometime;
        return { selectedCitta: cittaId, cetasikaList, sometimeCetasikaList };
      }),
  }))
);

export default store;
