import { Vector2d } from "konva/lib/types";
import CetasikaNode from "../ui/CetasikaNode";
import { cetasikaMap } from "./repository";
import { UVedana } from "@/entities/citta/@x/cetasika";
import { CetasikaID } from "./interface";

class CetasikaFactory {
  initialRadius = 20;

  createById(
    id: CetasikaID,
    options?: Partial<Vector2d & { radius: number; vedana?: UVedana }>
  ) {
    if (!cetasikaMap.has(id)) throw new Error(`Citta ${id} not found`);

    const { base, hetu } = cetasikaMap.get(id)!;

    return new CetasikaNode({
      id,
      name: `cetasika ${id}`,
      base: base,
      hetu,
      ...options,
      vedana: id === "vedana" ? options?.vedana : undefined,
    });
  }

  static modifyCetasika(
    node: CetasikaNode,
    id: CetasikaID,
    vedana?: UVedana,
    isAniyata?: boolean
  ) {
    if (!cetasikaMap.has(id)) throw new Error(`Cetasika ${id} not found`);
    const { base, hetu } = cetasikaMap.get(id)!;
    node.base = base;
    node.hetu = hetu;
    node.vedana = id === "vedana" && vedana ? vedana : undefined;
    node.isAniyata = isAniyata ?? false;
  }
}

export default CetasikaFactory;

export const cetasikaFactory = new CetasikaFactory();
