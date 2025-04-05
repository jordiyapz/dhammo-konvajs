import { UHetu, UHetuVariant, UVedana } from "./interface";

export const commonPalette = {
  baseGray: "#404040",
};

export const hetuColors = {
  lobha: "#4743ff",
  dosa: "#da0000",
  moha: "#af48ff",
  alobha: "#6fc381",
  adosa: "#e2711d",
  amoha: "#2fffe6",
} satisfies Record<UHetu, string>;

export const hetuVariantBgColors = {
  ahetuka: commonPalette.baseGray,
  lobha: "#242c4a",
  dosa: "#432323",
  moha: "#460161",
  dvihetuka: "#436311",
  tihetuka: "#164e63",
} satisfies Record<UHetuVariant, string>;

export const vedanaColors = {
  upekkha: "#666666",
  domanassa: "#da0000",
  dukkha: "#da0000",
  somanassa: "#faff00",
  sukha: "#faff00",
} satisfies Record<UVedana, string>;
