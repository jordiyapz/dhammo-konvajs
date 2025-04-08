import { UHetu, UHetuVariant, UVedana } from "@/entities/citta";
import {
  hetuColors,
  hetuVariantBgColors,
  vedanaColors,
} from "@/shared/palette";
import Konva from "konva";

type CetasikaNodeProps = {
  radius?: number;
  base?: UHetuVariant;
  vedana?: UVedana;
  hetu?: UHetu;
};

const Defaults = {
  baseRadius: 20,
  hetuRadius: 14,
};

class CetasikaNode extends Konva.Group {
  _radius = Defaults.baseRadius;
  _vedana: UVedana = "upekkha";
  _hetuVariant: UHetuVariant = "ahetuka";
  _hetu?: UHetu;

  _shapes: { base: any; hetu?: any } = { base: null };

  constructor(config: Konva.GroupConfig & CetasikaNodeProps) {
    const { radius: radius, vedana, base, hetu, ...rest } = config;

    super(rest);

    this._hetu = hetu ?? this._hetu;
    this._vedana = vedana ?? this._vedana;
    this._hetuVariant = base ?? this._hetuVariant;
    this.radius = radius ?? this._radius;

    this._shapes.base = new Konva.Circle({
      fill: hetu ? hetuColors[hetu] : hetuVariantBgColors[this._hetuVariant],
      strokeWidth: 8,
      stroke: vedana && vedanaColors[vedana],
      radius: vedana ? Defaults.baseRadius - 4 : Defaults.baseRadius,
      name: "base",
    });

    // this._shapes.hetu = new Konva.Circle({
    //   fill: this._hetu && hetuColors[this._hetu],
    //   radius: Defaults.hetuRadius,
    //   name: "hetu",
    // });

    this.add(this._shapes.base);
    // if (this._hetu) this.add(this._shapes.hetu);
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
}

export default CetasikaNode;
