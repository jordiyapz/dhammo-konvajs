import Konva from "konva";
import { CittaNode } from "@/entities/citta/@x/nama";
import { CetasikaNode } from "@/entities/cetasika/@x/nama";

import { UJati } from "../model/interface";
import { jatiColors } from "../model/palette";

const Defaults = {
  strokeWidth: 1,
  radius: 20,
  dash: [1, 2],
  padding: 4,
};

type NamaProps = {
  jati?: UJati;
  radius?: number;
  padding?: number;
};

class NamaContainer extends Konva.Group {
  _base: Konva.Circle;
  _nama?: CittaNode | CetasikaNode;
  _jati?: UJati;
  _padding: number = Defaults.padding;
  _radius: number = Defaults.radius;

  constructor(config?: NamaProps & Konva.GroupConfig) {
    const { jati, radius, padding, ...rest } = config ?? {};
    super({ name: "nama-container", ...rest });
    this._jati = jati;

    const stroke = this._jati ? jatiColors[this._jati] : undefined;

    this._base = new Konva.Circle({
      x: 0,
      y: 0,
      stroke,
      strokeWidth: Defaults.strokeWidth,
      lineCap: "round",
      dash: Defaults.dash,
      name: "base",
    });

    this.radius = radius ?? this._radius;

    this.add(this._base);
  }

  setJati(jati: UJati) {
    this._jati = jati;
    this._base.stroke(jatiColors[jati]);
  }

  attachItem(
    nama: CittaNode | CetasikaNode,
    options?: Partial<{ fitContainerToItem: boolean }>
  ) {
    if (this._nama) this.remove();

    this._nama = nama;
    this.add(nama);

    if (options?.fitContainerToItem) this._fitContainerToItem();
  }

  _fitContainerToItem(options?: Partial<{ padding: number }>) {
    if (this._nama) {
      this.setPosition(this._nama.getPosition());
      this._nama.setPosition({ x: 0, y: 0 });

      const namaRadius = this._nama.radius;
      const padding = options?.padding ?? Defaults.padding;
      this.radius = namaRadius + padding;
    }
  }

  get radius() {
    return this._radius;
  }
  set radius(radius: number) {
    this._radius = radius;
    this._base.radius(radius);
  }
}

export default NamaContainer;
