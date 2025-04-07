import Konva from "konva";
import { NamaContainer } from "@/entities/nama";
import {
  cittaFactory,
  cittaLayoutGroups,
  getCittaById,
} from "@/entities/citta";

class CittaTable extends Konva.Group {
  constructor(config: Konva.GroupConfig = {}) {
    super({ name: "citta-table", ...config });

    const gap = 12;
    const cittaRadius = 10;
    const cittaSpacing = cittaRadius * 2 + gap;

    let offsetX = 0;
    let offsetY = 0;

    for (const group of cittaLayoutGroups) {
      let rowCount = 0;
      for (const item of group) {
        const cittaNode = cittaFactory.createById(item.id, {
          x: item.x * cittaSpacing + offsetX,
          y: item.y * cittaSpacing + offsetY,
          radius: cittaRadius,
        });

        const container = new NamaContainer({
          jati: getCittaById(item.id)?.jati,
        });

        container.attachItem(cittaNode, { fitContainerToItem: true });
        this.add(container);

        rowCount = Math.max(rowCount, item.y + 1);
      }
      offsetY += rowCount * cittaSpacing + gap;
    }
  }
}

export default CittaTable;
