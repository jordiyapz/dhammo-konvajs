import Konva from "konva";

import Constants from "@/config/constant";
import { palette } from "@/entities/citta";

import CittaTable from "./ui/CittaTable";
import CittaSolarSystem from "./ui/CittaSolarSystem";

class CittaSangahaScene {
  background: any;
  cittaTable: any;
  solarSystem: any;

  constructor() {
    this.background = new Konva.Rect({
      x: 0,
      y: 0,
      width: Constants.virtualSize.width,
      height: Constants.virtualSize.height,
      fill: palette.backgroundGray,
    });

    this.cittaTable = new CittaTable({
      x: 40,
      y: 40,
      draggable: true,
    });

    this.cittaTable.on("dragend", () => {
      this.cittaTable.x(40);
    });

    this.solarSystem = new CittaSolarSystem({
      x: (Constants.virtualSize.width / 4) * 3,
      y: Constants.virtualSize.height / 2,
    });
  }

  attachToLayer(layer: Konva.Layer) {
    layer.add(this.background);
    layer.add(this.cittaTable);
    layer.add(this.solarSystem);
  }
}

export default CittaSangahaScene;
