import cittaJson from "@/assets/citta.json";
import cittaLayout from "@/assets/citta-layout.json";
import { Citta, CittaID } from "./interface";

interface CittaLayoutRow {
  group: number;
  id: CittaID;
  x: number;
  y: number;
}

export const cittaMap = new Map<CittaID, Citta>(
  cittaJson.map((citta) => [
    citta.id as CittaID,
    { ...citta, hetuVariant: citta.hetuvariant } as Citta,
  ])
);

export const getCittaById = (id: CittaID) => cittaMap.get(id);

export const cittaIds = Array.from(cittaMap.keys());

export const cittaLayoutMap = new Map(
  cittaLayout.map((citta) => [citta.id as CittaID, citta])
);

const maxGroup = Math.max(...cittaLayout.map((citta) => citta.group));

export const cittaLayoutGroups = Array.from({ length: maxGroup }, (_, i) =>
  (cittaLayout as Array<CittaLayoutRow>).filter(
    (citta) => citta.group === i + 1
  )
);
