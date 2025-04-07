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
  isExpanded = true;
  _onShrinkFn = () => {};

  base: Konva.Circle;
  citta: CittaNode;

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
    this.shrunkRadius = shrunkRadius;

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
    this.isExpanded = false;
    if (options?.skipAnimation) {
      this.citta.radius = this._shrunkRadius;
      this.base.radius(this._shrunkRadius);
      this.citta.opacity(0);
      this.base.opacity(1);
      if (!options.skipOnFinish) this._onShrinkFn();
      return;
    }
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
      onFinish: () => !options?.skipOnFinish && this._onShrinkFn(),
    });
  }

  expand(options?: Partial<{ skipAnimation: boolean }>) {
    this.isExpanded = true;
    if (options?.skipAnimation) {
      this.citta.radius = this._initialRadius;
      this.base.radius(this._initialRadius);
      this.citta.opacity(1);
      this.base.opacity(0);
      return;
    }

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
    if (this.isExpanded) {
      this.citta.radius = radius;
      this.base.radius(radius);
    }
  }

  set shrunkRadius(radius: number) {
    this._shrunkRadius = radius;
    if (!this.isExpanded) {
      this.citta.radius = radius;
      this.base.radius(radius);
    }
  }
}

export default Core;
