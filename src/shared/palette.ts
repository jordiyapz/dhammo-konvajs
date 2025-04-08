import { UHetu, UHetuVariant, UVedana } from "@/entities/citta";

const paletteGray = {
  100: "#F8F9FA",
  200: "#E9ECEF",
  300: "#DEE2E6",
  400: "#CED4DA",
  500: "#ADB5BD",
  600: "#6C757D",
  700: "#495057",
  800: "#343A40",
  900: "#212529",
};

export const palette = {
  grays: paletteGray,
  backgroundGray: paletteGray[900],
  purple: "#AF48FF",
};
export const hetuColors = {
  lobha: "#4743ff",
  dosa: "#da0000",
  moha: palette.purple,
  alobha: "#6fc381",
  adosa: "#e2711d",
  amoha: "#2fffe6",
} satisfies Record<UHetu, string>;

export const hetuVariantBgColors = {
  ahetuka: "#666666",
  lobha: "#242c4a",
  dosa: "#432323",
  moha: "#460161",
  dvihetuka: "#436311",
  tihetuka: "#164e63",
} satisfies Record<UHetuVariant, string>;

export const vedanaColors = {
  upekkha: "#454545",
  domanassa: "#da0000",
  dukkha: "#da0000",
  somanassa: "#faff00",
  sukha: "#faff00",
} satisfies Record<UVedana, string>;
