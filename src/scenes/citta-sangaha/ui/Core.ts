import { cittaFactory } from "@/entities/citta";
import Konva from "konva";

const Defaults = {
  initialRadius: 30,
  shrunkRadius: 20,
  shrunkEasing: Konva.Easings.StrongEaseIn,
  expandEasing: Konva.Easings.EaseOut,
  duration: 0.5,
};

type CoreProps = Partial<typeof Defaults> & {
  cittaId: string;
};

class Core extends Konva.Group {
  _initialRadius = Defaults.initialRadius;
  _shrunkRadius = Defaults.shrunkRadius;
  _isShrunk = false;
  _onShrinkFn = () => {};

  base: any;
  citta: any;

  constructor(config: Konva.GroupConfig & CoreProps) {
    const { cittaId, initialRadius, shrunkRadius } = config as CoreProps;
    super({ name: "core", ...config });

    this.citta = cittaFactory.createById(cittaId, {
      radius: initialRadius ?? Defaults.initialRadius,
    });

    this.base = new Konva.Circle({
      fill: "#ffffff",
      opacity: 0,
      radius: initialRadius ?? Defaults.initialRadius,
    });

    this.initialRadius = initialRadius ?? Defaults.initialRadius;
    this.shrunkRadius = shrunkRadius ?? Defaults.shrunkRadius;

    this.add(this.base, this.citta);
  }

  shrink() {
    this.citta.to({
      duration: Defaults.duration,
      easing: Defaults.shrunkEasing,
      radius: this._shrunkRadius,
      opacity: 0,
    });
    this.base.to({
      duration: Defaults.duration,
      easing: Defaults.shrunkEasing,
      radius: this._shrunkRadius,
      opacity: 1,
      onFinish: this._onShrinkFn,
    });
  }

  expand() {
    this.citta.to({
      duration: Defaults.duration,
      easing: Defaults.expandEasing,
      radius: this._initialRadius,
      opacity: 1,
    });
    this.base.to({
      duration: Defaults.duration,
      easing: Defaults.expandEasing,
      radius: this._initialRadius,
      opacity: 0,
    });
  }

  onShrinkEnd(f: () => void) {
    this._onShrinkFn = f;
  }

  set initialRadius(radius: number) {
    this._initialRadius = radius;
    if (!this._isShrunk) {
      this.citta.radius = radius;
      this.base.radius = radius;
    }
  }

  set shrunkRadius(radius: number) {
    this._shrunkRadius = radius;
    if (this._isShrunk) {
      this.citta.radius = radius;
      this.base.radius = radius;
    }
  }
}

export default Core;
