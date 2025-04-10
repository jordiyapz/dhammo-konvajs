import Konva from "konva";
import { NamaContainer } from "@/entities/nama";

import { cetasikaFactory, cetasikaLayoutGroups } from "@/entities/cetasika";

type CetasikaTableProps = {
  cetasikaRadius?: number;
};

class CetasikaTable extends Konva.Group {
  cetasikaRadius = 8;

  constructor(config: Konva.GroupConfig & CetasikaTableProps = {}) {
    super({ name: "cetasika-table", ...config });

    const gap = 10;
    const groupGap = 6;
    this.cetasikaRadius = config.cetasikaRadius ?? this.cetasikaRadius;

    const cetasikaSpacing = this.cetasikaRadius * 2 + gap;

    let offsetX = 0;
    let offsetY = 0;

    for (const group of cetasikaLayoutGroups) {
      let rowCount = 0;
      for (const item of group) {
        const cetasikaNode = cetasikaFactory.createById(item.id, {
          x: item.x * cetasikaSpacing + offsetX,
          y: item.y * cetasikaSpacing + offsetY,
          radius: this.cetasikaRadius,
          vedana: "upekkha",
        });

        const container = new NamaContainer({ jati: "vipaka" });
        container.attachItem(cetasikaNode, { fitContainerToItem: true });
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
      offsetY += rowCount * cetasikaSpacing + groupGap;
    }
  }
}

export default CetasikaTable;
