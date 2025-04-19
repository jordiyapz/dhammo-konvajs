import cetasikaJson from "@/assets/cetasika.json";
import cetasikaLayout from "@/assets/cetasika-layout.json";
import cetasikaAssociationJson from "@/assets/cetasika-association.json";
import { Cetasika, CetasikaID, CetasikaLayoutRow } from "./interface";
import { CittaID } from "@/entities/citta";

export const cetasikaIdList = cetasikaLayout.map((row) => row.id as CetasikaID);
export const cetasikaMap = new Map(
  cetasikaJson.map((cetasika) => [
    cetasika.id as CetasikaID,
    cetasika as Cetasika,
  ])
);

export const cetasikaAssociationMap = new Map(
  Object.entries(cetasikaAssociationJson).map(([key, value]) => [
    key as CetasikaID,
    value as CittaID[],
  ])
);

export const cetasikaLayoutGroups = Array.from(
  { length: new Set(cetasikaLayout.map((row) => row.group)).size },
  (_, i) =>
    (cetasikaLayout as Array<CetasikaLayoutRow>).filter(
      (cetasika) => cetasika.group === i + 1
    )
);

export function getCetasikaPosition(id: string) {
  return cetasikaLayout.findIndex((row) => row.id === id);
}
