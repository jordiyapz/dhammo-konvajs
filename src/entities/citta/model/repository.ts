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
export const combinationMap = new Map(
  combinationTable.map((val) => [val.id, val.cetasika ?? []])
);
