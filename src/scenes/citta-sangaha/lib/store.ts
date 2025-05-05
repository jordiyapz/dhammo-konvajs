import { createStore } from "zustand/vanilla";
import { subscribeWithSelector } from "zustand/middleware";

import {
  cittaIdList,
  cittaMap,
  getCittaAsociation,
  getCittaCombination,
} from "@/entities/citta";
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

        const association = getCittaAsociation(cittaId);
        if (!association) return { ...initialState, selectedCitta: cittaId };

        const cetasikaList = association.mustHave;
        const sometimeCetasikaList = association.sometime;
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
    setCombination: (index) =>
      set((s) => {
        if (s.selectedCitta === null) return { activeCombinationIndex: null };

        const association = getCittaAsociation(s.selectedCitta);
        const combinations = getCittaCombination(s.selectedCitta);
        if (!association || !combinations)
          return { activeCombinationIndex: null };

        const sometimeCetasikaList = index === null ? association.sometime : [];
        const cetasikaList =
          index === null
            ? association.mustHave
            : [...association.mustHave, ...combinations[index]];

        return {
          activeCombinationIndex: index,
          cetasikaList,
          sometimeCetasikaList,
        };
      }),
  }))
);

export default store;
