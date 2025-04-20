import cittaJson from "@/assets/citta.json";
import cittaLayout from "@/assets/citta-layout.json";
import combinationJson from "@/assets/citta-combination.json";
import { Citta, CittaID, CittaLayoutRow, CombinationRow } from "./interface";

export const cittaMap = new Map<CittaID, Citta>(
  cittaJson.map((citta) => [
    citta.id as CittaID,
    { ...citta, hetuVariant: citta.hetuvariant } as Citta,
  ])
);

export const getCittaById = (id: CittaID) => cittaMap.get(id);

export const cittaIdList = Array.from(cittaMap.keys());

const maxGroup = Math.max(...cittaLayout.map((citta) => citta.group));

export const cittaLayoutGroups = Array.from({ length: maxGroup }, (_, i) =>
  (cittaLayout as Array<CittaLayoutRow>).filter(
    (citta) => citta.group === i + 1
  )
);
export const combinationTable = combinationJson as CombinationRow[];

export const getCittaCombination = (id: CittaID) => {
  return combinationTable.find((row) => row.id === id);
};
