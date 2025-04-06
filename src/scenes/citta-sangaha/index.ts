import { cittaFactory, cittaLayoutGroups } from "@/entities/citta";
import { palette } from "@/entities/citta/model/palette";
import Konva from "konva";

class CittaSangahaScene {
  background: any;
  cittaGroup: any;

  constructor(stage: Konva.Stage) {
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: stage.width(),
      height: stage.height(),
      fill: palette.backgroundGray,
    });

    const cittaGroup = new Konva.Group({
      x: 40,
      y: 40,
      draggable: true,
    });

    let offsetX = 0;
    let offsetY = 0;
    const radius = 20;
    const gap = 10;

    for (const group of cittaLayoutGroups) {
      let rowCount = 0;
      for (const item of group) {
        const cittaNode = cittaFactory.createById(item.id, {
          x: item.x * (radius * 2 + gap) + offsetX,
          y: item.y * (radius * 2 + gap) + offsetY,
          radius,
        });
        cittaGroup.add(cittaNode);
        rowCount = Math.max(rowCount, item.y + 1);
      }
      offsetY += rowCount * 50 + 20;
    }

    // add the shape to the layer
    this.background = background;
    this.cittaGroup = cittaGroup;
  }

  attachToLayer(layer: Konva.Layer) {
    layer.add(this.background);
    layer.add(this.cittaGroup);
  }
}

export default CittaSangahaScene;
