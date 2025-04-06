import Constants from "@/config/constant";
import {
  cittaFactory,
  cittaLayoutGroups,
  getCittaById,
  palette,
} from "@/entities/citta";
import { NamaContainer } from "@/entities/nama";
import Konva from "konva";

class CittaSangahaScene {
  background: any;
  cittaGroup: any;

  constructor() {
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: Constants.virtualSize.width,
      height: Constants.virtualSize.height,
      fill: palette.backgroundGray,
    });

    const cittaGroup = new Konva.Group({
      x: 40,
      y: 40,
      draggable: true,
    });

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
        cittaGroup.add(container);

        rowCount = Math.max(rowCount, item.y + 1);
      }
      offsetY += rowCount * cittaSpacing + gap;
    }

    this.background = background;
    this.cittaGroup = cittaGroup;
  }

  attachToLayer(layer: Konva.Layer) {
    layer.add(this.background);
    layer.add(this.cittaGroup);
  }
}

export default CittaSangahaScene;
