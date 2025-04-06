import Konva from "konva";
import { UJati } from "../model/interface";
import { jatiColors } from "@/entities/citta/model/palette";
import CittaNode from "@/entities/citta/ui/CittaNode";

const Defaults = {
  strokeWidth: 1,
  radius: 20,
  dash: [2, 2],
  padding: 4,
};

type NamaProps = {
  jati?: UJati;
  radius?: number;
};

class NamaContainer extends Konva.Group {
  _base: Konva.Circle;
  _nama?: CittaNode;
  _jati?: UJati;

  constructor(config?: NamaProps & Konva.GroupConfig) {
    const { jati, radius = 20, ...rest } = config ?? {};
    super({ name: "nama-container", ...rest });
    this._jati = jati;

    const stroke = this._jati ? jatiColors[this._jati] : undefined;

    this._base = new Konva.Circle({
      x: 0,
      y: 0,
      radius: radius ?? Defaults.radius,
      stroke,
      strokeWidth: Defaults.strokeWidth,
      dash: Defaults.dash,
      name: "base",
    });

    this.add(this._base);
  }

  setJati(jati: UJati) {
    this._jati = jati;
    this._base.stroke(jatiColors[jati]);
  }

  attachItem(
    nama: CittaNode,
    options?: Partial<{ fitContainerToItem: boolean }>
  ) {
    if (this._nama) this.remove();

    this._nama = nama;
    this.add(nama);

    if (options?.fitContainerToItem) this._fitContainerToItem();
  }

  _fitContainerToItem() {
    if (this._nama) {
      this.setPosition(this._nama.getPosition());
      this._nama.setPosition({ x: 0, y: 0 });

      const namaRadius = this._nama.getRadius();
      this._base.radius(namaRadius + Defaults.padding);
    }
  }
}

export default NamaContainer;
