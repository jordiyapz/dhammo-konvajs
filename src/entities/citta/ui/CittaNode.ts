import Konva from "konva";
import { UHetu, UVedana, UHetuVariant } from "../model/interface";
import {
  hetuColors,
  hetuVariantBgColors,
  vedanaColors,
} from "../model/palette";

const Config = {
  borderWidth: 3,
  baseRadius: 20,
  hetuRadiusFactor: 0.25,
  hetuSpacingFactor: 0.35,
};

interface CittaParameters {
  radius: number;
  vedana?: UVedana;
  hetuVariant?: UHetuVariant;
}

class CittaNode extends Konva.Group {
  _radius: number;
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

    this._radius = radius;
    this._hetuVariant = hetuVariant;
    this._vedana = vedana;

    // Create the base
    this._base = new Konva.Circle({
      x: 0,
      y: 0,
      radius: Config.baseRadius,
      fill: hetuVariantBgColors[hetuVariant],
      stroke: vedanaColors[vedana ?? "upekkha"],
      strokeWidth: Config.borderWidth,
      lineCap: "round",
      dash: ["sukha", "dukkha"].includes(vedana) ? [6, 8] : undefined,
      name: "base",
    });

    // Create the hetu nodes
    this._hetuNodes = this._createHetuNodes();

    this.add(this._base);
    this.add(...this._hetuNodes);

    this.scale({
      x: radius / Config.baseRadius,
      y: radius / Config.baseRadius,
    });
  }

  getRadius() {
    return this._radius;
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
      numOfHetu === 1 ? 0 : Config.baseRadius * Config.hetuSpacingFactor;

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
    const hetuRadius = Config.baseRadius * Config.hetuRadiusFactor;

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
