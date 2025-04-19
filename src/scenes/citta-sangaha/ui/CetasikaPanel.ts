import {
  CetasikaFactory,
  cetasikaMap,
  CetasikaNode,
} from "@/entities/cetasika";
import { palette } from "@/shared/palette";
import Konva from "konva";
import store from "../lib/store";
import Constants from "@/config/constant";
import CloseButton from "@/shared/ui/CloseButton";

type CetasikaPanelProps = {
  width: number;
  radius?: number;
};

type CloseHandler = (e: Konva.KonvaEventObject<MouseEvent>) => void;

const Defaults = {
  radius: 20,
};

class CetasikaPanel extends Konva.Group {
  _nodes: {
    backdrop: Konva.Rect;
    cetasikaNode: CetasikaNode;
    text: Konva.Text;
  };
  _tweens?: {
    background: Konva.Tween;
    cetasika: Konva.Tween;
    text: Konva.Tween;
  };
  _onClose?: CloseHandler;

  constructor(config: Konva.GroupConfig & CetasikaPanelProps) {
    const {
      radius = Defaults.radius,
      width,
      height = Constants.virtualSize.height,
    } = config;

    super({ ...config, height, width });

    const backdrop = new Konva.Rect({
      width: this.width(),
      height: this.height(),
      fill: palette.grays[800],
      opacity: 0,
    });
    const cetasikaNode = new CetasikaNode({
      x: backdrop.width() / 2,
      y: backdrop.height() / 2,
      radius: radius,
      opacity: 0,
    });
    const text = new Konva.Text({
      y: cetasikaNode.y() + radius + 10,
      fontSize: 20,
      fontFamily: "Arial",
      align: "center",
      fill: palette.grays[400],
      opacity: 0,
    });
    const closeBtn = new CloseButton({ y: 20 });
    closeBtn.x(width - closeBtn.width() - 20);

    this._nodes = { backdrop, cetasikaNode, text };

    this.add(...Object.values(this._nodes), closeBtn);
    this.hide();
    this.initializeTweens();

    // Event handlers

    const handleClose = (e: Konva.KonvaEventObject<PointerEvent>) => {
      this.hide();
      this._onClose?.(e);
    };

    backdrop.on("pointerclick", handleClose);
    closeBtn.on("pointerclick", handleClose);

    store.subscribe(
      ({ selectedCetasika }) => ({ selectedCetasika }),
      ({ selectedCetasika }) => {
        if (selectedCetasika !== null) {
          this.setText(
            cetasikaMap.get(selectedCetasika)?.name ?? selectedCetasika
          );
          CetasikaFactory.modifyCetasika(
            cetasikaNode,
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
        node: this._nodes.cetasikaNode,
        easing: Konva.Easings.EaseInOut,
        duration: 0.3,
        opacity: 1,
      }),
      text: new Konva.Tween({
        node: this._nodes.text,
        easing: Konva.Easings.EaseInOut,
        duration: 1,
        opacity: 1,
      }),
    };
  }

  setText(text: string) {
    this._nodes.text.text(text);
    this._nodes.text.x(this.width() / 2 - this._nodes.text.width() / 2);
  }

  show() {
    super.show();
    if (this._tweens) {
      this._tweens.background.play();
      this._tweens.text.play();
      this._tweens.cetasika.play();
      this._tweens.background.onFinish = () => {
        this._tweens?.cetasika.play();
        this._tweens?.text.play();
      };
    }
    return this;
  }

  hide() {
    if (this._tweens) {
      this._tweens.background.reverse();
      this._tweens.cetasika.reverse();
      this._tweens.text.reverse();
      this._tweens.background.onReset = () => super.hide();
    } else super.hide();
    return this;
  }

  onClose(cb: CloseHandler) {
    this._onClose = cb;
  }
}

export default CetasikaPanel;
