import Konva from "konva";

import Constants from "@/config/constant";
import { palette } from "@/shared/palette";
import { cetasikaMap } from "@/entities/cetasika";

import CittaTable from "./ui/CittaTable";
import CetasikaTable from "./ui/CetasikaTable";
import Tooltip from "./ui/Tooltip";
import { Vector2d } from "konva/lib/types";
import SolarPanel from "./ui/SolarPanel";
import store from "./lib/store";

class CittaSangahaScene {
  components: any[] = [];

  _background: any;
  _cittaTable: CittaTable;
  _solarPanel: SolarPanel;
  _cetasikaTable: CetasikaTable;
  _cetasikaTooltip: any;

  constructor() {
    this._background = new Konva.Rect({
      x: 0,
      y: 0,
      width: Constants.virtualSize.width,
      height: Constants.virtualSize.height,
      fill: palette.backgroundGray,
    });

    const cittaRadius = 10;
    const cetasikaRadius = 8;
    const cittaTableInitialPosition: Vector2d = { x: 40, y: 40 };
    const cetasikaTableInitialPosition: Vector2d = {
      x: Constants.virtualSize.width / 2 + 40,
      y: 40,
    };

    this._cittaTable = new CittaTable({
      ...cittaTableInitialPosition,
      cittaRadius,
      draggable: true,
    });
    this._cittaTable.setAvailableCittas(store.getState().cittaList);

    this._solarPanel = new SolarPanel({
      width: Constants.virtualSize.width / 2,
      height: Constants.virtualSize.height,
    });

    this._cetasikaTable = new CetasikaTable({
      ...cetasikaTableInitialPosition,
      cetasikaRadius,
      draggable: true,
    });

    this._cetasikaTooltip = new Tooltip({ fontSize: 10 });
    this._cetasikaTooltip.hide();

    // EVENT LISTENERS
    const { selectCitta } = store.getState();
    store.subscribe(
      (state) => [state.selectedCitta, state.cetasikaList],
      ([selectedCitta, cetasikaList]) =>
        console.debug({ cetasikaList, selectedCitta })
    );

    this._cittaTable.on("dragend", (e) => {
      e.target.x(cittaTableInitialPosition.x);
    });
    this._cittaTable.on("pointerout dragstart", () => {
      this._cetasikaTooltip.hide();
    });
    this._cittaTable.on("pointerover", (e) => {
      const { x, y, name: targetName } = e.target.attrs;
      const words = targetName.split(" ");
      if (words.length == 2) {
        const [_, id] = words;
        const cetasika = cetasikaMap.get(id);
        this.showTooltip({
          text: cetasika?.name ?? id,
          x: x + this._cittaTable.x(),
          y: y + this._cittaTable.y() + cetasikaRadius,
        });
      }
    });

    this._cittaTable.onClickCitta((id) => {
      this.hideTooltip();
      selectCitta(id);
    });

    this._solarPanel.onClose(() => {
      this.hideTooltip();
      selectCitta(null);
    });

    this._cetasikaTable.on("dragend", (e) => {
      e.target.x(cetasikaTableInitialPosition.x);
    });
    this._cetasikaTable.on("pointerout dragstart", () => {
      this._cetasikaTooltip.hide();
    });
    this._cetasikaTable.on("pointerover", (e) => {
      const { x, y, name: targetName } = e.target.attrs;
      const words = targetName.split(" ");
      if (words.length == 2) {
        const [_, id] = words;
        const cetasika = cetasikaMap.get(id);
        this.showTooltip({
          text: cetasika?.name ?? id,
          x: x + this._cetasikaTable.x(),
          y: y + this._cetasikaTable.y() + cetasikaRadius,
        });
      }
    });

    this.components.push(
      this._background,
      this._cittaTable,
      this._solarPanel,
      this._cetasikaTable,
      this._cetasikaTooltip
    );
  }

  attachToLayer(layer: Konva.Layer) {
    layer.add(...this.components);
  }

  showTooltip(args: { text: string; x: number; y: number }) {
    this._cetasikaTooltip.show();
    this._cetasikaTooltip.text = args.text;
    this._cetasikaTooltip.position({
      x: args.x,
      y: args.y,
    });
  }

  hideTooltip() {
    this._cetasikaTooltip.hide();
  }
}

export default CittaSangahaScene;
