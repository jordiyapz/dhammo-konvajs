import Konva from "konva";

import Constants from "@/config/constant";
import { palette } from "@/shared/palette";

import CittaTable from "./ui/CittaTable";
import CittaSolarSystem from "./ui/CittaSolarSystem";
import CetasikaTable from "./ui/CetasikaTable";
import { CetasikaNode } from "@/entities/cetasika";
import Tooltip from "./ui/Tooltip";

class CittaSangahaScene {
  _background: any;
  _cittaTable: any;
  _cetasikaTable: any;
  _solarSystem: any;
  _cetasikaTooltip: any;

  components: any[] = [];

  constructor() {
    this._background = new Konva.Rect({
      x: 0,
      y: 0,
      width: Constants.virtualSize.width,
      height: Constants.virtualSize.height,
      fill: palette.backgroundGray,
    });

    this._cittaTable = new CittaTable({
      x: 40,
      y: 40,
      draggable: true,
    });

    this._cittaTable.on("dragend", () => {
      this._cittaTable.x(40);
    });

    this._solarSystem = new CittaSolarSystem({
      x: Constants.virtualSize.width / 4,
      y: Constants.virtualSize.height / 2,
    });

    this._cetasikaTable = new CetasikaTable({
      x: Constants.virtualSize.width / 2 + 40,
      y: 40,
    });

    this._cetasikaTooltip = new Tooltip({
      x: Constants.virtualSize.width / 2,
      y: 40,
      draggable: true,
      fontSize: 10,
    });

    this._cetasikaTooltip.text = "Phassā";
    this._cetasikaTooltip.position({
      x: Constants.virtualSize.width / 2 + 40,
      y: 40 + 8,
    });

    this.components.push(
      this._background,
      this._cittaTable,
      this._solarSystem,
      this._cetasikaTable,
      this._cetasikaTooltip
    );
  }

  attachToLayer(layer: Konva.Layer) {
    layer.add(...this.components);
  }
}

export default CittaSangahaScene;
