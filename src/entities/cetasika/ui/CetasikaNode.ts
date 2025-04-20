import { UHetu, UHetuVariant, UVedana } from "@/entities/citta";
import {
  hetuColors,
  hetuVariantBgColors,
  palette,
  vedanaColors,
} from "@/shared/palette";
import Konva from "konva";

type CetasikaNodeProps = {
  radius?: number;
  base?: UHetuVariant;
  vedana?: UVedana;
  hetu?: UHetu;
  isAniyata?: boolean;
};

const Defaults = {
  baseRadius: 20,
  hetuRadius: 14,
};

class CetasikaNode extends Konva.Group {
  _radius = Defaults.baseRadius;
  _vedana?: UVedana;
  _hetuVariant: UHetuVariant = "ahetuka";
  _hetu?: UHetu;

  _nodes: { base: any; vedana: any; aniyata: any };

  constructor(config: Konva.GroupConfig & CetasikaNodeProps) {
    const { radius: radius, vedana, base, hetu, isAniyata, ...rest } = config;

    super(rest);

    this._hetu = hetu ?? this._hetu;
    this._hetuVariant = base ?? this._hetuVariant;
    this.radius = radius ?? this._radius;
    const baseNode = new Konva.Circle({
      fill: hetu ? hetuColors[hetu] : hetuVariantBgColors[this._hetuVariant],
      radius: Defaults.baseRadius,
      name: "base",
      shadowColor: "black",
      shadowBlur: 5,
      shadowOpacity: 0.5,
      shadowOffset: { x: 2, y: 2 },
    });

    const vedanaRing = new Konva.Circle({
      radius: Defaults.baseRadius - 4,
      strokeWidth: 8,
      name: "vedana-ring",
      lineCap: "round",
    });

    const aniyata = new Konva.Text({
      text: "?",
      fontSize: 24,
      name: "aniyata",
      fill: "white",
      stroke: palette.grays[800],
      strokeWidth: .5,
    });
    aniyata.x(-aniyata.width() / 2);
    aniyata.y(-aniyata.height() / 2);
    if (!isAniyata) aniyata.hide();

    this._nodes = { base: baseNode, vedana: vedanaRing, aniyata };

    this.add(baseNode, vedanaRing, aniyata);

    this.vedana = vedana;
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

  set base(base: UHetuVariant) {
    this._hetuVariant = base;
    this._nodes.base.fill(hetuVariantBgColors[this._hetuVariant]);
  }

  set hetu(hetu: UHetu | undefined) {
    this._hetu = hetu;
    if (hetu) this._nodes.base.fill(hetuColors[hetu]);
  }

  set vedana(vedana: UVedana | undefined) {
    this._vedana = vedana;
    this._nodes.vedana.stroke(vedana && vedanaColors[vedana]);
    if (vedana && ["sukha", "dukkha"].includes(vedana))
      this._nodes.vedana.dash([4, 10]);
    else this._nodes.vedana.dash(undefined);
  }

  set isAniyata(isAniyata: boolean) {
    this._nodes.aniyata.visible(isAniyata);
  }
}

export default CetasikaNode;
