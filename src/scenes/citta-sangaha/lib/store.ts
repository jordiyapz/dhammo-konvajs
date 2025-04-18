import { createStore } from "zustand/vanilla";
import { subscribeWithSelector } from "zustand/middleware";

import { cittaIdList, getCittaCombination } from "@/entities/citta";
import { cetasikaAssociationMap, cetasikaIdList } from "@/entities/cetasika";
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
          return {
            selectedCitta: null,
            cittaList: initialState.cittaList,
            cetasikaList: initialState.cetasikaList,
            sometimeCetasikaList: initialState.sometimeCetasikaList,
          };

        const combination = getCittaCombination(cittaId);
        if (!combination)
          return {
            selectedCitta: cittaId,
            cittaList: initialState.cittaList,
            cetasikaList: [],
          };

        const cetasikaList = combination.mustHave;
        const sometimeCetasikaList = combination.sometime;
        return {
          selectedCitta: cittaId,
          selectedCetasika: null,
          cittaList: initialState.cittaList,
          cetasikaList,
          sometimeCetasikaList,
        };
      }),
    selectCetasika: (cetasikaId) =>
      set(() => {
        if (cetasikaId === null)
          return { selectedCetasika: null, cittaList: initialState.cittaList };

        return {
          selectedCetasika: cetasikaId,
          cittaList: cetasikaAssociationMap.get(cetasikaId) ?? [],
        };
      }),
  }))
);

export default store;
