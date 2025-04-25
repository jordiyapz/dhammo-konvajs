import Konva from "konva";
import Core from "./Core";
import Orbit, { OrbitProps } from "./Orbit";
import { CittaID, UVedana } from "@/entities/citta";
import { CetasikaID } from "@/entities/cetasika";

type CittaSolarSystemProps = {
  cittaId?: CittaID;
  orbitOptions?: OrbitProps;
};

class CittaSolarSystem extends Konva.Group {
  isExpanded = false;

  core: Core;
  orbit: Orbit;

  constructor(config: Konva.GroupConfig & CittaSolarSystemProps = {}) {
    super({ name: "citta-solar-system", ...config });

    const { cittaId = "lobha1" } = config;

    this.core = new Core({ cittaId, initialRadius: 40, shrunkRadius: 30 });
    this.orbit = new Orbit(config.orbitOptions);

    this.core.onShrinkEnd(() => this.orbit.expand());
    this.orbit.onShrinkEnd(() => this.core.expand());

    this.core.on("pointerclick", () => {
      this.isExpanded = !this.isExpanded;
      if (this.isExpanded) this.shrink();
      else this.expand();
    });

    this.add(this.orbit, this.core);
  }

  setCitta(citta: CittaID) {
    this.core.setCitta(citta);
  }

  expand(options?: Partial<{ skipAnimation: boolean }>) {
    this.core.shrink(options);
    // if (options?.skipAnimation) this.orbit.expand(options);
  }

  shrink(options?: Partial<{ skipAnimation: boolean }>) {
    this.orbit.shrink(options);
    if (options?.skipAnimation) this.core.expand(options);
  }
}

export default CittaSolarSystem;
