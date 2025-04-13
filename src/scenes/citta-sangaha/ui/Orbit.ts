import { computeLargeRadius, generateCirclePoints } from "@/shared/utils";
import Konva from "konva";

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
  revolveAnimation: Konva.Animation;
  planets: Konva.Circle[] = [];
  planetRadius = Defaults.planetRadius;
  expandedPositions: { x: number; y: number }[] = [];
  isExpanded = false;
  _onShrinkFn = () => {};

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

    this.expandedPositions = this._calculateExpandedPositions({ gap: 10 });

    this.revolveAnimation = new Konva.Animation((frame) => {
      if (!frame) return;
      const angle = (frame.time * angularVelocity * 2 * Math.PI) / 1000;
      this.rotation(angle);
    });
  }

  expand(options?: Partial<{ skipAnimation: boolean }>) {
    this.isExpanded = true;
    this.revolveAnimation.start();
    this.planets.forEach((cetasika, index) => {
      const pos = this.expandedPositions[index];
      if (options?.skipAnimation) {
        cetasika.radius(this.planetRadius);
        cetasika.x(pos.x);
        cetasika.y(pos.y);
        cetasika.opacity(1);
        return;
      }
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

  shrink(options?: Partial<{ skipAnimation: boolean }>) {
    this.isExpanded = false;

    this.planets.forEach((cetasika, i) => {
      if (options?.skipAnimation) {
        cetasika.radius(0);
        cetasika.x(0);
        cetasika.y(0);
        cetasika.opacity(0);
        return;
      }
      cetasika.to({
        x: 0,
        y: 0,
        duration: Defaults.duration,
        opacity: 0,
        radius: 0,
        easing: Defaults.shrunkEasing,
        onFinish: () => {
          if (i === 0) this._onShrinkFn();
          this.revolveAnimation.stop();
        },
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
