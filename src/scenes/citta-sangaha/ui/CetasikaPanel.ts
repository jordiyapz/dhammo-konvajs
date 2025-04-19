import { CetasikaFactory, CetasikaNode } from "@/entities/cetasika";
import { palette } from "@/shared/palette";
import Konva from "konva";
import store from "../lib/store";

type CetasikaPanelProps = {
  width: number;
  radius?: number;
};

const Defaults = {
  radius: 20,
};

class CetasikaPanel extends Konva.Group {
  _nodes: { backdrop: Konva.Rect; selectedCetasikaNode: CetasikaNode };
  _tweens?: { background: Konva.Tween; cetasika: Konva.Tween };

  constructor(config: Konva.GroupConfig & CetasikaPanelProps) {
    super({ ...config, width: config.width });
    const { radius = Defaults.radius } = config;

    const backdrop = new Konva.Rect({
      width: this.width(),
      height: this.height(),
      fill: palette.grays[800],
      opacity: 0,
    });
    const selectedCetasikaNode = new CetasikaNode({
      x: backdrop.width() / 2,
      y: backdrop.height() / 2,
      radius: radius,
      opacity: 0,
    });

    this._nodes = { backdrop, selectedCetasikaNode };

    this.add(backdrop, selectedCetasikaNode);
    this.hide();

    // Event handlers
    this.getStage()
    this.initializeTweens();
    this.on("layeradd", () => {
      console.debug("layeradd listened");
      this.initializeTweens();
    });
    store.subscribe(
      ({ selectedCetasika }) => ({ selectedCetasika }),
      ({ selectedCetasika }) => {
        if (selectedCetasika === null) {
          this.hide();
        } else {
          CetasikaFactory.modifyCetasika(
            selectedCetasikaNode,
            selectedCetasika,
            selectedCetasika === "vedana" ? store.getState().vedana : undefined
          );
          this.show();
        }
      }
    );
  }

  initializeTweens() {
    // Tweens
    this._tweens = {
      background: new Konva.Tween({
        node: this._nodes.backdrop,
        easing: Konva.Easings.EaseInOut,
        duration: 0.3,
        opacity: 0.7,
      }),
      cetasika: new Konva.Tween({
        node: this._nodes.selectedCetasikaNode,
        easing: Konva.Easings.EaseInOut,
        duration: 0.3,
        opacity: 1,
      }),
    };
  }

  show() {
    super.show();
    if (this._tweens) {
      this._tweens.background.play();
      this._tweens.background.onFinish = () => this._tweens?.cetasika.play();
    }
    return this;
  }

  hide() {
    if (this._tweens) {
      this._tweens.background.reverse();
      this._tweens.cetasika.reverse();
      this._tweens.background.onReset = () => super.hide();
    }
    return this;
  }
}

export default CetasikaPanel;
