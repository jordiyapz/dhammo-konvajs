import CittaNode from "../ui/CittaNode";
import { UHetuVariant, UVedana } from "./interface";
import { cittaMap } from "./repository";

class CittaFactory {
  initialRadius: number;
  constructor(options: { radius?: number } = {}) {
    this.initialRadius = options.radius ?? 50;
  }

  createById(
    id: string,
    options: { radius?: number; x?: number; y?: number } = {}
  ) {
    if (!cittaMap.has(id)) throw new Error(`Citta ${id} not found`);

    const { vedana, hetuvariant } = cittaMap.get(id)!;
    const radius = options.radius ?? this.initialRadius;
    const x = options.x ?? 0;
    const y = options.y ?? 0;
    return new CittaNode({
      x,
      y,
      radius,
      vedana: vedana as UVedana,
      hetuVariant: hetuvariant as UHetuVariant,
    });
  }
}

export default CittaFactory;

export const cittaFactory = new CittaFactory();
