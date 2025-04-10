import Konva from "konva";
import Core from "./Core";
import Orbit from "./Orbit";

class CittaSolarSystem extends Konva.Group {
  isExpanded = false;

  core: Core;
  orbit: Orbit;

  constructor(config: Konva.GroupConfig = {}) {
    super({ name: "citta-solar-system", ...config });

    this.core = new Core({ cittaId: "mkus1" });
    this.orbit = new Orbit();

    this.core.onShrinkEnd(() => this.orbit.expand());
    this.orbit.onShrinkEnd(() => this.core.expand());

    this.core.on("click", () => {
      this.isExpanded = !this.isExpanded;
      if (this.isExpanded) {
        this.shrink();
      } else {
        this.expand();
      }
    });

    this.add(this.orbit, this.core);
  }

  expand(options?: Partial<{ skipAnimation: boolean }>) {
    this.core.shrink(options);
    if (options?.skipAnimation) this.orbit.expand(options);
  }
  shrink(options?: Partial<{ skipAnimation: boolean }>) {
    this.orbit.shrink(options);
    if (options?.skipAnimation) this.core.expand(options);
  }
}

export default CittaSolarSystem;
