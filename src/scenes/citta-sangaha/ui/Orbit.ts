import Konva from "konva";
import {
  generateCirclePoints,
  computeLargeRadius,
} from "@/shared/lib/geometry";
import {
  CetasikaFactory,
  CetasikaID,
  cetasikaIdList,
  CetasikaNode,
} from "@/entities/cetasika";
import { UVedana } from "@/entities/citta";

const Defaults = {
  orbitAngularVelocity: 10, // rad/s
  planetRadius: 8,
  shrunkEasing: Konva.Easings.StrongEaseIn,
  expandEasing: Konva.Easings.EaseOut,
  duration: 0.5,
};

export type OrbitProps = {
  planetRadius?: number;
  minimalRadius?: number;
  angularVelocity?: number /** Rad/s */;
  satellites?: { must: CetasikaID[]; sometime: CetasikaID[] };
};

type Planet = CetasikaNode;

class Orbit extends Konva.Group {
  planetRadius;
  minimalRadius;
  orbitRadius;

  planetPool: Array<Planet> = [];
  planets: Array<{ id: CetasikaID; node: Planet; tween: Konva.Tween }> = [];
  _onShrinkFn = () => {};

  revolveAnimation: Konva.Animation;
  tweens: Konva.Tween[] = [];

  constructor(config: Konva.GroupConfig & OrbitProps = {}) {
    super({ name: "cetasika-orbit", ...config });

    const {
      angularVelocity = Defaults.orbitAngularVelocity,
      planetRadius = Defaults.planetRadius,
      minimalRadius,
    } = config;

    this.minimalRadius = minimalRadius ?? 0;
    this.orbitRadius = this.minimalRadius;
    this.planetRadius = planetRadius;
    this.planetPool = Array.from({ length: 38 }).map(() => {
      const node = new CetasikaNode({
        radius: this.planetRadius,
      }).hide();

      return node;
    });

    this.add(...this.planetPool.map((node) => node));

    if (config.satellites) this.setSatellites(config.satellites);

    this.revolveAnimation = new Konva.Animation((frame) => {
      if (!frame) return;
      const angle = (frame.time * angularVelocity * 2 * Math.PI) / 1000;
      this.rotation(angle);
    });
  }

  expand(options?: Partial<{ skipAnimation: boolean }>) {
    this.revolveAnimation.start();
    this.planets.forEach((planet) => {
      if (options?.skipAnimation) planet.tween.finish();
      else planet.tween.play();
    });
  }

  shrink(options?: Partial<{ skipAnimation: boolean }>) {
    this.planets.forEach((planet) => {
      if (options?.skipAnimation) planet.tween.reset();
      else planet.tween.reverse();
    });
  }

  onShrinkEnd(f: () => void) {
    this._onShrinkFn = f;
  }

  _calculateExpandedPositions(options: { numOfPlanets: number; gap?: number }) {
    const { gap = 0, numOfPlanets } = options;
    const planetRadius = this.planetRadius;
    const orbitRadius = Math.max(
      computeLargeRadius(planetRadius, numOfPlanets, gap),
      this.minimalRadius
    );
    this.orbitRadius = orbitRadius;
    const points = generateCirclePoints(numOfPlanets, orbitRadius);
    return points.map(([x, y]) => ({ x, y }));
  }

  setSatellites(args: {
    must: CetasikaID[];
    sometime: CetasikaID[];
    vedana?: UVedana;
    nodeEvents?: Array<
      [string, (id: CetasikaID, e: Konva.KonvaEventObject<Konva.Group>) => void]
    >;
  }) {
    const { must, sometime, vedana } = args;

    this.planets.forEach((p) => {
      p.node.hide();
      p.tween.destroy();
    });

    const expandedPositions = this._calculateExpandedPositions({
      numOfPlanets: must.length + sometime.length,
      gap: 10,
    });

    const cetasikaList = [
      ...must.map((id) => ({ id, isAniyata: false })),
      ...sometime.map((id) => ({ id, isAniyata: true })),
    ];
    cetasikaList.sort(
      (a, b) =>
        cetasikaIdList.findIndex((id) => id === a.id) -
        cetasikaIdList.findIndex((id) => id === b.id)
    );

    const planets = cetasikaList.map((cetasika, i) => {
      const { id, isAniyata } = cetasika;
      const node = this.planetPool[i];
      node.visible(true);
      CetasikaFactory.modifyCetasika(node, id, vedana, isAniyata);
      const tween = new Konva.Tween({
        node,
        x: expandedPositions[i].x,
        y: expandedPositions[i].y,
        duration: Defaults.duration,
        opacity: 1,
        radius: this.planetRadius,
        easing: Defaults.expandEasing,
      });
      for (const [event, fn] of args.nodeEvents ?? []) {
        node.on(event, (e) => fn(id, e));
      }
      return { id, node, tween };
    });

    planets[0].tween.onReset = () => {
      this._onShrinkFn();
      this.revolveAnimation.stop();
    };

    this.planets = planets;
  }
}

export default Orbit;
