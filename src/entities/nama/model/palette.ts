import { palette } from "@/shared/palette";
import { UJati } from "./interface";

export const jatiColors = {
  akusala: palette.purple,
  kusala: "#ffa000",
  vipaka: "gray",
  kiriya: "#168eA3",
} satisfies Record<UJati, string>;
