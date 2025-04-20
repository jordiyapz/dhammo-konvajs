import { palette } from "@/shared/palette";
import Konva from "konva";
import CittaSolarSystem from "./CittaSolarSystem";
import Constants from "@/config/constant";
import { CittaID, getCittaCombination } from "@/entities/citta";
import store from "../lib/store";
import CloseButton from "@/shared/ui/CloseButton";

class SolarPanel extends Konva.Group {
  expandTimer?: NodeJS.Timeout;
  _background: Konva.Rect;

  _onClose: (e?: Konva.KonvaEventObject<MouseEvent>) => void = () => {};
  _solarSystem: CittaSolarSystem;

  constructor(config: Konva.GroupConfig) {
    const {
      width = Constants.virtualSize.width,
      height = Constants.virtualSize.height,
      ...rest
    } = config;

    super({ opacity: 0, ...rest });
    super.hide();

    this._background = new Konva.Rect({
      width,
      height,
      opacity: 0.7,
      fill: palette.grays[800],
    });

    this._solarSystem = new CittaSolarSystem({
      x: width / 2,
      y: height / 2,
      orbitOptions: { angularVelocity: 2, planetRadius: 10, minimalRadius: 50 },
    });

    const closeBtn = new CloseButton({ y: 20 });
    closeBtn.x(width - closeBtn.width() - 20);

    this.add(this._background, this._solarSystem, closeBtn);

    const handleClose = (e?: Konva.KonvaEventObject<MouseEvent>) => {
      clearTimeout(this.expandTimer);
      this.hide();
      this._onClose(e);
    };
    closeBtn.on("pointerclick", handleClose);
    this._background.on("pointerclick", handleClose);

    store.subscribe(
      (state) => ({ selectedCitta: state.selectedCitta, vedana: state.vedana }),
      (state) => {
        if (state.selectedCitta !== null) {
          this.setCitta(state.selectedCitta);
          this.show();
          const combination = getCittaCombination(state.selectedCitta);
          if (!combination) return;
          this._solarSystem.setSatellites({
            must: combination.mustHave,
            sometime: combination.sometime,
            vedana: state.vedana,
          });
        }
      }
    );

    // TESTS
    // setTimeout(() => store.getState().selectCitta("dosa1"), 500);
  }

  setCitta(citta: CittaID) {
    this._solarSystem.setCitta(citta);
  }

  show() {
    super.show();
    this.to({ opacity: 1 });
    this.expandTimer = setTimeout(() => this._solarSystem.expand(), 500);
    return this;
  }

  hide() {
    this.to({
      opacity: 0,
      onFinish: () => {
        super.hide();
        this._solarSystem.shrink({ skipAnimation: true });
      },
    });
    return this;
  }

  onClose(callback: (e?: Konva.KonvaEventObject<MouseEvent>) => void) {
    this._onClose = callback;
  }
}

export default SolarPanel;
