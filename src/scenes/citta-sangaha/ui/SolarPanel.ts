import { palette } from "@/shared/palette";
import Konva from "konva";
import CittaSolarSystem from "./CittaSolarSystem";
import Constants from "@/config/constant";

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
      orbitOptions: { angularVelocity: 2 },
    });

    this.add(this._background, this._solarSystem);

    this._background.on("click", (e) => {
      clearTimeout(this.expandTimer);
      this.hide();
      this._onClose(e);
    });
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
