import { cittaFactory, CittaNode } from "@/entities/citta";
import Konva from "konva";

const Defaults = {
  initialRadius: 20,
  shrunkRadius: 10,
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
  _onShrinkFn = () => {};

  base: Konva.Circle;
  citta: CittaNode;

  baseTween!: Konva.Tween;
  cittaTween!: Konva.Tween;

  constructor(config: Konva.GroupConfig & CoreProps) {
    const {
      cittaId,
      initialRadius = Defaults.initialRadius,
      shrunkRadius = Defaults.shrunkRadius,
    } = config as CoreProps;
    super({ name: "core", ...config });

    this.citta = cittaFactory.createById(cittaId, {
      radius: initialRadius,
    });

    this.base = new Konva.Circle({
      fill: "white",
      opacity: 1,
      radius: initialRadius,
    });

    this.initialRadius = initialRadius;
    this.shrunkRadius = shrunkRadius;  // also initialize tweens

    this.add(this.base, this.citta);

    this.on("mouseover", function (e) {
      const stage = e.target.getStage();
      if (stage) stage.container().style.cursor = "pointer";
    });
    this.on("mouseout", function (e) {
      const stage = e.target.getStage();
      if (stage) stage.container().style.cursor = "default";
    });
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
    this.citta.radius = radius;
    this.base.radius(radius);
  }

  set shrunkRadius(radius: number) {
    this._shrunkRadius = radius;
    this.reinitializeTweens();
  }

  reinitializeTweens() {
    this.cittaTween = new Konva.Tween({
      node: this.citta,
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
