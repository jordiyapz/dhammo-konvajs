import { CetasikaID } from "@/entities/cetasika/@x/citta";
import { UJati } from "@/entities/nama/@x/citta";

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
  id: CittaID;
  hetuVariant: UHetuVariant;
  vedana: UVedana;
  jati: UJati;
  name?: string;
}

export type CittaID =
  | "lobha1"
  | "lobha2"
  | "lobha3"
  | "lobha4"
  | "lobha5"
  | "lobha6"
  | "lobha7"
  | "lobha8"
  | "dosa1"
  | "dosa2"
  | "moha1"
  | "moha2"
  | "cakkhu1"
  | "sota1"
  | "ghana1"
  | "jivha1"
  | "kaya1"
  | "sam1"
  | "san1"
  | "cakkhu2"
  | "sota2"
  | "ghana2"
  | "jivha2"
  | "kaya2"
  | "sam2"
  | "san2"
  | "san3"
  | "pancadv"
  | "manodv"
  | "has"
  | "mkus1"
  | "mkus2"
  | "mkus3"
  | "mkus4"
  | "mkus5"
  | "mkus6"
  | "mkus7"
  | "mkus8"
  | "mvip1"
  | "mvip2"
  | "mvip3"
  | "mvip4"
  | "mvip5"
  | "mvip6"
  | "mvip7"
  | "mvip8"
  | "mkir1"
  | "mkir2"
  | "mkir3"
  | "mkir4"
  | "mkir5"
  | "mkir6"
  | "mkir7"
  | "mkir8"
  | "rkus1"
  | "rkus2"
  | "rkus3"
  | "rkus4"
  | "rkus5"
  | "rvip1"
  | "rvip2"
  | "rvip3"
  | "rvip4"
  | "rvip5"
  | "rkir1"
  | "rkir2"
  | "rkir3"
  | "rkir4"
  | "rkir5"
  | "arkus1"
  | "arkus2"
  | "arkus3"
  | "arkus4"
  | "arvip1"
  | "arvip2"
  | "arvip3"
  | "arvip4"
  | "arkir1"
  | "arkir2"
  | "arkir3"
  | "arkir4"
  | "sotmg1"
  | "sotmg2"
  | "sotmg3"
  | "sotmg4"
  | "sotmg5"
  | "sakmg1"
  | "sakmg2"
  | "sakmg3"
  | "sakmg4"
  | "sakmg5"
  | "anamg1"
  | "anamg2"
  | "anamg3"
  | "anamg4"
  | "anamg5"
  | "aramg1"
  | "aramg2"
  | "aramg3"
  | "aramg4"
  | "aramg5"
  | "sotph1"
  | "sotph2"
  | "sotph3"
  | "sotph4"
  | "sotph5"
  | "sakph1"
  | "sakph2"
  | "sakph3"
  | "sakph4"
  | "sakph5"
  | "anaph1"
  | "anaph2"
  | "anaph3"
  | "anaph4"
  | "anaph5"
  | "araph1"
  | "araph2"
  | "araph3"
  | "araph4"
  | "araph5";
export interface CittaCombination {
  mustHave: CetasikaID[];
  sometime: CetasikaID[];
  variations: CetasikaID[][];
  vedana?: UVedana;
}
export interface CittaLayoutRow {
  group: number;
  id: CittaID;
  x: number;
  y: number;
}
export interface AssociationRow {
  id: CittaID;
  mustHave: CetasikaID[];
  sometime: CetasikaID[];
}

export interface CombinationRow {
  id: CittaID;
  cetasika?: CetasikaID[];
}
