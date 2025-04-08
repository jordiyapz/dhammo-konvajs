import CittaNode from "../ui/CittaNode";
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

    const { vedana, hetuVariant } = cittaMap.get(id)!;
    const radius = options.radius ?? this.initialRadius;
    const x = options.x ?? 0;
    const y = options.y ?? 0;

    return new CittaNode({
      x,
      y,
      radius,
      vedana,
      hetuVariant,
      name: `citta ${id}`,
      id: id,
    });
  }
}

export default CittaFactory;

export const cittaFactory = new CittaFactory();
