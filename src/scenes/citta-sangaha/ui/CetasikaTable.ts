import Konva from "konva";
import { NamaContainer } from "@/entities/nama";

import { cetasikaFactory, cetasikaLayoutGroups } from "@/entities/cetasika";

class CetasikaTable extends Konva.Group {
  constructor(config: Konva.GroupConfig = {}) {
    super({ name: "cetasika-table", ...config });

    const gap = 10;
    const groupGap = 6;
    const cetasikaRadius = 8;
    const cetasikaSpacing = cetasikaRadius * 2 + gap;

    let offsetX = 0;
    let offsetY = 0;

    for (const group of cetasikaLayoutGroups) {
      let rowCount = 0;
      for (const item of group) {
        // const cetasika = cetasikaMap.get(item.id);
        const cetasikaNode = cetasikaFactory.createById(item.id, {
          x: item.x * cetasikaSpacing + offsetX,
          y: item.y * cetasikaSpacing + offsetY,
          radius: cetasikaRadius,
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

        // container.on("mouseover", function (e) {});
        this.add(container, hitbox);

        rowCount = Math.max(rowCount, item.y + 1);
      }
      offsetY += rowCount * cetasikaSpacing + groupGap;
    }
  }
}

export default CetasikaTable;
