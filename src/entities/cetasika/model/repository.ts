import cetasikaJson from "@/assets/cetasika.json";
import combinationJson from "@/assets/association.json";
import cetasikaLayout from "@/assets/cetasika-layout.json";
import { AssociationRow as CombinationRow, Cetasika, CetasikaID } from "./interface";
import { CittaID } from "@/entities/citta/@x/cetasika";

export const cetasikaIdList = cetasikaLayout.map((row) => row.id as CetasikaID);
export const cetasikaMap = new Map(
  cetasikaJson.map((cetasika) => [
    cetasika.id as CetasikaID,
    cetasika as Cetasika,
  ])
);

export const cetasikaLayoutGroups = Array.from(
  { length: new Set(cetasikaLayout.map((row) => row.group)).size },
  (_, i) => cetasikaLayout.filter((cetasika) => cetasika.group === i + 1)
);

export const combinationTable = combinationJson as CombinationRow[];
export const getCetasikaCombination = (id: CittaID) => {
  return combinationTable.find((row) => row.id === id);
};

export function getCetasikaPosition(id: string) {
  return cetasikaLayout.findIndex((row) => row.id === id);
}
