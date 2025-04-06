import { UJati } from "@/entities/nama";

export type UHetu = "lobha" | "dosa" | "moha" | "alobha" | "adosa" | "amoha";

export type UHetuVariant =
  | "ahetuka"
  | "lobha"
  | "dosa"
  | "moha"
  | "dvihetuka"
  | "tihetuka";

export type UVedana =
  | "upekkha"
  | "somanassa"
  | "domanassa"
  | "sukha"
  | "dukkha";

export interface Citta {
  id: string;
  hetuVariant: UHetuVariant;
  vedana: UVedana;
  jati: UJati;
}
