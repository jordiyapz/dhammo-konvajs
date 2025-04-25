import Konva from "konva";
import {
  CittaFactory,
  cittaFactory,
  CittaID,
  CittaNode,
} from "@/entities/citta";
import { setCursorStyle } from "@/shared/utils";

const Defaults = {
  initialRadius: 20,
  shrunkRadius: 10,
  shrunkEasing: Konva.Easings.StrongEaseIn,
  expandEasing: Konva.Easings.EaseOut,
  duration: 0.5,
};

type CoreProps = Partial<typeof Defaults> & {
  cittaId: CittaID;
};

class Core extends Konva.Group {
  _initialRadius = Defaults.initialRadius;
  _shrunkRadius = Defaults.shrunkRadius;
  _onShrinkFn = () => {};

  base: Konva.Circle;
  _cittaId: CittaID;
  _cittaNode: CittaNode;

  baseTween!: Konva.Tween;
  cittaTween!: Konva.Tween;

  constructor(config: Konva.GroupConfig & CoreProps) {
    const {
      cittaId,
      initialRadius = Defaults.initialRadius,
      shrunkRadius = Defaults.shrunkRadius,
    } = config as CoreProps;
    super({ name: "core", ...config });

    this._cittaId = cittaId ?? "lobha1";
    this._cittaNode = cittaFactory.createById(cittaId, {
      radius: initialRadius,
    });

    this.base = new Konva.Circle({
      fill: "white",
      opacity: 1,
      radius: initialRadius,
    });

    this.initialRadius = initialRadius;
    this.shrunkRadius = shrunkRadius; // also initialize tweens

    this.add(this.base, this._cittaNode);

    this.on("pointerover", function (e) {
      const stage = e.target.getStage();
      if (stage) setCursorStyle(stage, "pointer");
    });
    this.on("pointerout", function (e) {
      const stage = e.target.getStage();
      if (stage) setCursorStyle(stage, "default");
    });
  }

  setCitta(cittaId: CittaID) {
    this._cittaId = cittaId;
    CittaFactory.updateCitta(this._cittaNode, cittaId);
  }

  shrink(options?: Partial<{ skipAnimation: boolean; skipOnFinish: boolean }>) {
    if (options?.skipAnimation) {
      this.cittaTween.finish();
      this.baseTween.finish();
      return;
    }
    this.cittaTween.play();
    this.baseTween.play();
  }

  expand(options?: Partial<{ skipAnimation: boolean }>) {
    if (options?.skipAnimation) {
      this.cittaTween.reset();
      this.baseTween.reset();
      return;
    }
    this.cittaTween.reverse();
    this.baseTween.reverse();
  }

  onShrinkEnd(f: () => void) {
    this._onShrinkFn = f;
  }

  set initialRadius(radius: number) {
    this._initialRadius = radius;
    this._cittaNode.radius = radius;
    this.base.radius(radius);
  }

  get shrunkRadius() {
    return this._shrunkRadius;
  }
  set shrunkRadius(radius: number) {
    this._shrunkRadius = radius;
    this.reinitializeTweens();
  }

  reinitializeTweens() {
    this.cittaTween = new Konva.Tween({
      node: this._cittaNode,
      duration: Defaults.duration,
      easing: Defaults.shrunkEasing,
      radius: this._shrunkRadius,
      opacity: 0,
    });
    this.baseTween = new Konva.Tween({
      node: this.base,
      duration: Defaults.duration,
      easing: Defaults.shrunkEasing,
      radius: this._shrunkRadius,
      opacity: 1,
      onFinish: () => this._onShrinkFn(),
    });
  }
}

export default Core;
