import { createStore } from "zustand/vanilla";
import { subscribeWithSelector } from "zustand/middleware";

import { cittaIdList, cittaMap, getCittaAsociation } from "@/entities/citta";
import { cetasikaAssociationMap, cetasikaIdList } from "@/entities/cetasika";
import { CittaSangahaState, CittaSangahaValues } from "./interface";

const initialState: CittaSangahaValues = {
  selectedCitta: null,
  selectedCetasika: null,
  cittaList: cittaIdList,
  cetasikaList: cetasikaIdList,
  sometimeCetasikaList: [],
  activeCombinationIndex: null,
  vedana: "upekkha",
};

const store = createStore<CittaSangahaState>()(
  subscribeWithSelector((set) => ({
    ...initialState,
    selectCitta: (cittaId) =>
      set(() => {
        if (cittaId === null) return { ...initialState, selectedCitta: null };

        const combination = getCittaAsociation(cittaId);
        if (!combination) return { ...initialState, selectedCitta: cittaId };

        const cetasikaList = combination.mustHave;
        const sometimeCetasikaList = combination.sometime;
        return {
          ...initialState,
          selectedCitta: cittaId,
          vedana: cittaMap.get(cittaId)!.vedana,
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
    setCombination: (index) => set(() => ({ activeCombinationIndex: index })),
  }))
);

export default store;
