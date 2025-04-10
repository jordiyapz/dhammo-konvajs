import Konva from "konva";
import { NamaContainer } from "@/entities/nama";
import {
  cittaFactory,
  cittaLayoutGroups,
  getCittaById,
} from "@/entities/citta";

type CittaTableProps = {
  cittaRadius?: number;
};

class CittaTable extends Konva.Group {
  constructor(config: Konva.GroupConfig & CittaTableProps = {}) {
    super({ name: "citta-table", ...config });

    const { cittaRadius = 18 } = config;

    const gap = 12;
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
        const hitbox = new Konva.Circle({
          x: container.x(),
          y: container.y(),
          radius: container.radius,
          name: `hitbox ${item.id}`,
        });
        hitbox.on("mouseover", (e) => {
          const stage = e.target.getStage();
          if (stage) stage.container().style.cursor = "pointer";
        });
        hitbox.on("mouseout", (e) => {
          const stage = e.target.getStage();
          if (stage) stage.container().style.cursor = "default";
        });

        this.add(container, hitbox);
        rowCount = Math.max(rowCount, item.y + 1);
      }
      offsetY += rowCount * cittaSpacing + gap;
    }
  }
}

export default CittaTable;
