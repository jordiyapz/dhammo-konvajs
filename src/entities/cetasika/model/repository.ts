import cetasikaJson from "@/assets/cetasika.json";
import cetasikaLayout from "@/assets/cetasika-layout.json";
import { Cetasika, CetasikaID } from "./interface";

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

export function getCetasikaPosition(id: string) {
  return cetasikaLayout.findIndex((row) => row.id === id);
}
