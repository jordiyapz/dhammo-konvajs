import Konva from "konva";
import { UHetu, UVedana, UHetuVariant } from "../model/interface";
import {
  hetuColors,
  hetuVariantBgColors,
  vedanaColors,
} from "@/shared/palette";

const Defaults = {
  borderWidth: 3,
  baseRadius: 20,
  hetuRadiusFactor: 0.25,
  hetuSpacingFactor: 0.35,
  dash: [6, 8],
};

interface CittaParameters {
  radius?: number;
  vedana?: UVedana;
  hetuVariant?: UHetuVariant;
}

class CittaNode extends Konva.Group {
  _radius: number = Defaults.baseRadius;
  _vedana: UVedana;
  _hetuVariant: UHetuVariant;

  _base: Konva.Circle;
  _hetuNodes: Konva.Circle[] = [];

  constructor(options: Konva.GroupConfig & CittaParameters) {
    const {
      radius,
      hetuVariant = "ahetuka",
      vedana = "upekkha",
      ...config
    } = options;

    super({ name: "citta", ...config });

    if (radius !== undefined) this.radius = radius;

    this._hetuVariant = hetuVariant;
    this._vedana = vedana;

    // Create the base
    this._base = new Konva.Circle({
      x: 0,
      y: 0,
      radius: Defaults.baseRadius,
      fill: hetuVariantBgColors[hetuVariant],
      stroke: vedanaColors[vedana ?? "upekkha"],
      strokeWidth: Defaults.borderWidth,
      lineCap: "round",
      dash: ["sukha", "dukkha"].includes(vedana) ? Defaults.dash : undefined,
      name: "base",
    });

    // Create the hetu nodes
    this._hetuNodes = this._createHetuNodes();

    this.add(this._base);
    this.add(...this._hetuNodes);
  }

  get radius() {
    return this._radius;
  }

  set radius(radius: number) {
    this._radius = radius;
    this.scale({
      x: radius / Defaults.baseRadius,
      y: radius / Defaults.baseRadius,
    });
  }

  set vedana(vedana: UVedana) {
    this._vedana = vedana;
    this._base.stroke(vedanaColors[vedana]);
    if (["sukha", "dukkha"].includes(vedana)) {
      this._base.dash(Defaults.dash);
    }
  }

  set hetuVariant(hetuVariant: UHetuVariant) {
    this._hetuVariant = hetuVariant;
    this._base.fill(hetuVariantBgColors[hetuVariant]);
    this._hetuNodes.forEach((node) => {
      node.destroy();
    });
    this._hetuNodes = this._createHetuNodes();
    this.add(...this._hetuNodes);
  }

  _getHetuList(hetuVariant: UHetuVariant): UHetu[] {
    switch (hetuVariant) {
      case "moha":
        return ["moha"];
      case "lobha":
        return ["moha", "lobha"];
      case "dosa":
        return ["moha", "dosa"];
      case "dvihetuka":
        return ["alobha", "adosa"];
      case "tihetuka":
        return ["alobha", "adosa", "amoha"];
      default:
        return [];
    }
  }

  _getHetuCoordinates(
    numOfHetu: number,
    center: { x?: number; y?: number } = {}
  ) {
    /**Given an Angle: If you know the center (h, k), radius (r), and an angle (θ) in radians, you can find the coordinates (x, y) of a point on the circle using the following formulas:
     * x = h + r * cos(θ)
     * y = k + r * sin(θ)
     */

    if (numOfHetu === 0) return [];

    const h = center.x ?? 0;
    const k = center.y ?? 0;

    const radius =
      numOfHetu === 1 ? 0 : Defaults.baseRadius * Defaults.hetuSpacingFactor;

    const points: { x: number; y: number }[] = [];

    for (let i = 0; i < numOfHetu; i++) {
      const angle = (i * 2 * Math.PI) / numOfHetu + (numOfHetu - 2) / 2;
      const x = h + radius * Math.cos(angle);
      const y = k + radius * Math.sin(angle);
      points.push({ x, y });
    }

    return points;
  }

  _createHetuNodes() {
    const hetuList = this._getHetuList(this._hetuVariant);

    const numOfHetu = hetuList.length;
    const hetuRadius = Defaults.baseRadius * Defaults.hetuRadiusFactor;

    if (!numOfHetu) return [];

    const points = this._getHetuCoordinates(numOfHetu, { x: 0, y: 0 });

    return points.map((p, i) => {
      const hetuObj = new Konva.Circle({
        x: p.x,
        y: p.y,
        radius: hetuRadius,
        fill: hetuColors[hetuList[i]],
        name: "hetu",
      });
      return hetuObj;
    });
  }
}

export default CittaNode;
