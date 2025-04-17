import Konva from "konva";
import {
  generateCirclePoints,
  computeLargeRadius,
} from "@/shared/lib/geometry";

const Defaults = {
  orbitAngularVelocity: 10, // rad/s
  planetRadius: 8,
  shrunkEasing: Konva.Easings.StrongEaseIn,
  expandEasing: Konva.Easings.EaseOut,
  duration: 0.5,
};

export type OrbitProps = {
  /** Rad/s */
  angularVelocity?: number;
};

class Orbit extends Konva.Group {
  planets: Konva.Circle[] = [];
  planetRadius = Defaults.planetRadius;
  _onShrinkFn = () => {};

  revolveAnimation: Konva.Animation;
  tweens: Konva.Tween[] = [];

  constructor(config: Konva.GroupConfig & OrbitProps = {}) {
    super({
      name: "cetasika-orbit",
      ...config,
    });

    const { angularVelocity = Defaults.orbitAngularVelocity } = config;

    this.planets = Array.from({ length: 33 }).map(
      () =>
        new Konva.Circle({
          radius: 0,
          opacity: 0,
          fill: "red",
        })
    );
    this.add(...this.planets);

    const expandedPositions = this._calculateExpandedPositions({ gap: 10 });
    expandedPositions.forEach((pos, index) => {
      const onReset =
        index !== 0
          ? undefined
          : () => {
              this._onShrinkFn();
              this.revolveAnimation.stop();
            };
      this.tweens.push(
        new Konva.Tween({
          node: this.planets[index],
          ...pos,
          duration: Defaults.duration,
          opacity: 1,
          radius: this.planetRadius,
          easing: Defaults.expandEasing,
          onReset,
        })
      );
    });

    this.revolveAnimation = new Konva.Animation((frame) => {
      if (!frame) return;
      const angle = (frame.time * angularVelocity * 2 * Math.PI) / 1000;
      this.rotation(angle);
    });
  }

  expand(options?: Partial<{ skipAnimation: boolean }>) {
    this.revolveAnimation.start();
    this.tweens.forEach((tween) => {
      if (options?.skipAnimation) tween.finish();
      else tween.play();
    });
  }

  shrink(options?: Partial<{ skipAnimation: boolean }>) {
    this.tweens.forEach((tween) => {
      if (options?.skipAnimation) tween.reset();
      else tween.reverse();
    });
  }

  onShrinkEnd(f: () => void) {
    this._onShrinkFn = f;
  }

  _calculateExpandedPositions(options: Partial<{ gap: number }> = {}) {
    const { gap = 0 } = options;
    const numOfPlanets = this.planets.length;
    const planetRadius = Defaults.planetRadius;
    const orbitRadius = computeLargeRadius(planetRadius, numOfPlanets, gap);
    const points = generateCirclePoints(numOfPlanets, orbitRadius);
    return points.map(([x, y]) => ({ x, y }));
  }
}

export default Orbit;
