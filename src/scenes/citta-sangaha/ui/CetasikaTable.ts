import Konva from "konva";
import { NamaContainer } from "@/entities/nama";

import { cetasikaFactory } from "@/entities/cetasika";
import { cetasikaLayoutGroups } from "@/entities/cetasika/model/repository";
// import { KonvaNodeEvent } from "konva/lib/types";
// import { KonvaEventListener } from "konva/lib/Node";

class CetasikaTable extends Konva.Group {
  // cetasikaEventHandlers: KonvaEventListener<CetasikaTable, KonvaNodeEvent>[] =
  //   [];

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
        // container.on("mouseover", function (e) {});
        this.add(container);

        rowCount = Math.max(rowCount, item.y + 1);
      }
      offsetY += rowCount * cetasikaSpacing + groupGap;
    }
  }
}

export default CetasikaTable;
