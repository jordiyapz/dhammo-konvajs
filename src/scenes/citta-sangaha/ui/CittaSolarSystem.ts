import Konva from "konva";
import Core from "./Core";
import Orbit, { OrbitProps } from "./Orbit";
import { CittaID } from "@/entities/citta";

type CittaSolarSystemProps = {
  cittaId?: CittaID;
  orbitOptions?: OrbitProps;
};

class CittaSolarSystem extends Konva.Group {
  isExpanded = false;

  core: Core;
  orbit: Orbit;

  _onClickCore?: () => void;
  _onExpand?: () => void;
  _onShrink?: () => void;

  constructor(config: Konva.GroupConfig & CittaSolarSystemProps = {}) {
    super({ name: "citta-solar-system", ...config });

    const { cittaId = "lobha1" } = config;

    this.core = new Core({ cittaId, initialRadius: 40, shrunkRadius: 30 });
    this.orbit = new Orbit(config.orbitOptions);

    this.core.onShrinkEnd(() => this.orbit.expand());
    this.orbit.onShrinkEnd(() => this.core.expand());

    this.core.on("pointerclick", () => {
      if (this.isExpanded) this.shrink();
      else this.expand();
      this._onClickCore?.();
    });

    this.add(this.orbit, this.core);
  }

  setCitta(citta: CittaID) {
    this.core.setCitta(citta);
  }

  expand(options?: Partial<{ skipAnimation: boolean }>) {
    this.isExpanded = true;
    this.core.shrink(options);
    this._onExpand?.();
    // if (options?.skipAnimation) this.orbit.expand(options);
  }

  shrink(options?: Partial<{ skipAnimation: boolean }>) {
    this.isExpanded = false;
    this.orbit.shrink(options);
    if (options?.skipAnimation) this.core.expand(options);
    this._onShrink?.();
  }

  onClickCore(cb: () => void) {
    this._onClickCore = cb;
  }

  onExpand(cb: () => void) {
    this._onExpand = cb;
  }

  onShrink(cb: () => void) {
    this._onShrink = cb;
  }
}

export default CittaSolarSystem;
