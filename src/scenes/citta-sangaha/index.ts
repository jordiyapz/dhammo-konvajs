import Konva from "konva";

import Constants from "@/config/constant";

import CittaTable from "./ui/CittaTable";
import CittaSolarSystem from "./ui/CittaSolarSystem";
import { associationTable } from "@/entities/cetasika";
import { getCetasikaAssociation } from "@/entities/cetasika/lib/util";
import { palette } from "@/shared/palette";

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

    associationTable.forEach((row) => {
      const association = getCetasikaAssociation(row.id);
      (["mustHave", "sometime"] as Array<"mustHave" | "sometime">).forEach(
        (key) => {
          row[key].sort();
          association[key].sort();
          if (row[key].length === 0 && association[key].length === 0) return;
          if (
            row[key].length !== association[key].length ||
            row[key].every((x, i) => x !== association[key][i])
          ) {
            console.debug({
              key,
              id: row.id,
              row: row[key],
              association: association[key],
            });
          }
        }
      );
    });
  }

  attachToLayer(layer: Konva.Layer) {
    layer.add(this.background);
    layer.add(this.cittaTable);
    layer.add(this.solarSystem);
  }
}

export default CittaSangahaScene;
