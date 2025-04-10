import Konva from "konva";

import Constants from "@/config/constant";
import { palette } from "@/shared/palette";
import { cetasikaMap } from "@/entities/cetasika";

import CittaTable from "./ui/CittaTable";
import CittaSolarSystem from "./ui/CittaSolarSystem";
import CetasikaTable from "./ui/CetasikaTable";
import Tooltip from "./ui/Tooltip";

class CittaSangahaScene {
  _background: any;
  _cittaTable: CittaTable;
  _cetasikaTable: CetasikaTable;
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

    this._cittaTable.on("dragend", (e) => {
      e.target.x(40);
    });

    this._solarSystem = new CittaSolarSystem({
      x: Constants.virtualSize.width / 4,
      y: Constants.virtualSize.height / 2,
    });

    const cetasikaRadius = 8;

    this._cetasikaTable = new CetasikaTable({
      x: Constants.virtualSize.width / 2 + 40,
      y: 40,
      cetasikaRadius,
      draggable: true,
    });

    this._cetasikaTooltip = new Tooltip({
      x: Constants.virtualSize.width / 2,
      y: 40,
      draggable: true,
      fontSize: 10,
    });
    this._cetasikaTooltip.hide();
    this._cetasikaTable.on("dragend", (e) => {
      e.target.x(Constants.virtualSize.width / 2 + 40);
    });
    this._cetasikaTable.on("mouseout dragstart", (e) => {
      this._cetasikaTooltip.hide();
    });
    this._cetasikaTable.on("mouseover", (e) => {
      const { x, y, name: targetName } = e.target.attrs;
      const words = targetName.split(" ");
      if (words.length == 2) {
        const [_, id] = words;
        const cetasika = cetasikaMap.get(id);
        if (cetasika) this._cetasikaTooltip.show();
        this._cetasikaTooltip.text = cetasika?.name ?? id;
        this._cetasikaTooltip.position({
          x: x + this._cetasikaTable.x(),
          y: y + this._cetasikaTable.y() + cetasikaRadius,
        });
      }
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
