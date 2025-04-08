import cetasikaJson from "@/assets/cetasika.json";
import associationJson from "@/assets/association.json";
import cetasikaLayout from "@/assets/cetasika-layout.json";
import { AssociationRow, Cetasika } from "./interface";

export const cetasikaIdList = cetasikaLayout.map((row) => row.id);
export const cetasikaMap = new Map(
  cetasikaJson.map((cetasika) => [cetasika.id, cetasika as Cetasika])
);

export const cetasikaLayoutGroups = Array.from(
  { length: new Set(cetasikaLayout.map((row) => row.group)).size },
  (_, i) => cetasikaLayout.filter((cetasika) => cetasika.group === i + 1)
);

export const associationTable = associationJson as AssociationRow[];

export function getCetasikaPosition(id: string) {
  return cetasikaLayout.findIndex((row) => row.id === id);
}
