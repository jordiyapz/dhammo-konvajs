import Konva from "konva";

import Constants from "@/config/constant";
import { palette } from "@/shared/palette";
import { CittaID, cittaIds } from "@/entities/citta";
import { cetasikaMap, cetasikaIdList, CetasikaID } from "@/entities/cetasika";

import CittaTable from "./ui/CittaTable";
import CetasikaTable from "./ui/CetasikaTable";
import Tooltip from "./ui/Tooltip";
import { Vector2d } from "konva/lib/types";
import SolarPanel from "./ui/SolarPanel";

interface CittaSangahaState {
  selectedCitta: CittaID | null;
  selectedCetasika: CetasikaID | null;
  cittaList: CittaID[];
  cetasikaList: CetasikaID[];
  activeVariant: CetasikaID[];
}

const initialState: CittaSangahaState = {
  selectedCitta: null,
  selectedCetasika: null,
  cittaList: cittaIds,
  cetasikaList: cetasikaIdList,
  activeVariant: [],
};

class CittaSangahaScene {
  _state: CittaSangahaState = initialState;
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
    this._cittaTable.setAvailableCittas(this.state.cittaList);

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
      this._solarPanel.show();
      this.setState({ ...this.state, selectedCitta: id });
    });

    this._solarPanel.onClose(() => {
      this.hideTooltip();
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

  get state() {
    return this._state;
  }

  setState(newState: CittaSangahaState) {
    this._state = newState;
    this._cittaTable.setAvailableCittas(this.state.cittaList);
    if (this.state.selectedCitta) {
      this._solarPanel.setCitta(this.state.selectedCitta);
    }
    // this._cittaTable.setActiveCitta(this.state.selectedCitta);
    // this._cetasikaTable.setAvailableCetasikas(this.state.cetasikaList);
    // this._cetasikaTable.setActiveCetasika(this.state.activeVariant);
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
