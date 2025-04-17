import { UHetu, UHetuVariant } from "@/entities/citta/@x/cetasika";

export type CetasikaGroupType = "annasamana" | "akusala" | "sobhana";

export type CetasikaID =
  | "phassa"
  | "vedana"
  | "sanna"
  | "cetana"
  | "ekaggata"
  | "jivitindriya"
  | "manasikara"
  | "vitakka"
  | "vicara"
  | "adhimokha"
  | "viriya"
  | "piti"
  | "chanda"
  | "moha"
  | "ahirika"
  | "anottappa"
  | "uddaccha"
  | "lobha"
  | "ditthi"
  | "mana"
  | "dosa"
  | "issa"
  | "macchariya"
  | "kukuccha"
  | "thina"
  | "middha"
  | "vicikiccha"
  | "saddha"
  | "sati"
  | "hiri"
  | "ottappa"
  | "alobha"
  | "adosa"
  | "tatramajjhattata"
  | "cittapasadhi"
  | "cittalahutta"
  | "cittamudutta"
  | "cittakammannata"
  | "cittapagunnata"
  | "cittujukata"
  | "kayapasadhi"
  | "kayalahutta"
  | "kayamudutta"
  | "kayakammannata"
  | "kayapagunnata"
  | "kayujukata"
  | "sammavaca"
  | "sammakammanta"
  | "sammajiva"
  | "karuna"
  | "mudita"
  | "panna";

export type CetasikaGroupTerms =
  | "sabbaSaddharana"
  | "pakinnaka"
  | "mohaCatukka"
  | "dosaCatukka"
  | "lobhaTri"
  | "thinamiddha"
  | "sobhanaSaddharana"
  | "virati"
  | "appamanna";

export interface Cetasika {
  id: CetasikaID;
  name: string;
  hetu: UHetu;
  base: UHetuVariant;
  order: number;
}

export interface CetasikaLayoutRow {
  id: CetasikaID;
  group: number;
  x: number;
  y: number;
}
