import { Vector2d } from "konva/lib/types";
import CetasikaNode from "../ui/CetasikaNode";
import { cetasikaMap } from "./repository";
import { UVedana } from "@/entities/citta/@x/cetasika";

class CetasikaFactory {
  initialRadius = 20;

  createById(
    id: string,
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
}

export default CetasikaFactory;

export const cetasikaFactory = new CetasikaFactory();
