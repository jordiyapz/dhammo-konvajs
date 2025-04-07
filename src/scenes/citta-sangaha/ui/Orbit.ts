import { computeLargeRadius, generateCirclePoints } from "@/shared/utils";
import Konva from "konva";

const Defaults = {
  orbitAngularVelocity: 2 * Math.PI * 10,
  planetRadius: 8,
  shrunkEasing: Konva.Easings.StrongEaseIn,
  expandEasing: Konva.Easings.EaseOut,
  duration: 0.5,
};

class Orbit extends Konva.Group {
  revolveAnimation: Konva.Animation;
  planets: Konva.Circle[] = [];
  planetRadius = Defaults.planetRadius;
  expandedPositions: { x: number; y: number }[] = [];

  _onShrinkFn = () => {};

  constructor(config: Konva.GroupConfig = {}) {
    super({ name: "cetasika-orbit", ...config });

    this.planets = Array.from({ length: 33 }).map(
      () =>
        new Konva.Circle({
          radius: 0,
          opacity: 0,
          fill: "red",
        })
    );
    this.add(...this.planets);

    this.expandedPositions = this._calculateExpandedPositions({ gap: 10 });

    this.revolveAnimation = new Konva.Animation((frame) => {
      if (!frame) return;
      const angle = (frame.time / 1000) * Defaults.orbitAngularVelocity;
      this.rotation(angle);
    });
  }

  expand() {
    this.revolveAnimation.start();
    this.planets.forEach((cetasika, index) => {
      const pos = this.expandedPositions[index];
      cetasika.to({
        x: pos.x,
        y: pos.y,
        duration: Defaults.duration,
        opacity: 1,
        radius: this.planetRadius,
        easing: Defaults.expandEasing,
      });
    });
  }

  shrink() {
    this.planets.forEach((cetasika, i) => {
      cetasika.to({
        x: 0,
        y: 0,
        duration: Defaults.duration,
        opacity: 0,
        radius: 0,
        easing: Defaults.shrunkEasing,
        onFinish: () => (i === 0 ? this._onShrinkFn() : undefined),
      });
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
