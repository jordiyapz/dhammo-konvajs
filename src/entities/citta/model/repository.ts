import cittaJson from "@/assets/citta.json";
import cittaLayout from "@/assets/citta-layout.json";
import associationJson from "@/assets/citta-association.json";
import combinationJson from "@/assets/citta-combination.json";

import {
  Citta,
  CittaID,
  CittaLayoutRow,
  AssociationRow,
  CombinationRow,
} from "./interface";

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

const associationTable = associationJson as AssociationRow[];

export const getCittaAsociation = (id: CittaID) => {
  return associationTable.find((row) => row.id === id);
};

const combinationTable = combinationJson as CombinationRow[];

/**
 * Given a citta id, returns an list of cetasika combinations that it can associate with.
 * If no combination is found, returns null.
 * @param id The id of the citta to look up.
 * @returns An array of cetasika that the citta can associate with, or null.
 */
export const getCittaCombination = (id: CittaID) => {
  const rows = combinationTable.filter((row) => row.id === id);
  if (rows.length === 0) return null;
  return rows.map((row) => row.cetasika ?? []);
};
