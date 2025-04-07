import Konva from "konva";
import Core from "./Core";
import Orbit from "./Orbit";

class CittaSolarSystem extends Konva.Group {
  isExpanded = false;

  constructor(config: Konva.GroupConfig = {}) {
    super({ name: "citta-solar-system", ...config });

    const core = new Core({ cittaId: "lobha1" });
    const orbit = new Orbit();

    core.on("click", () => {
      this.isExpanded = !this.isExpanded;
      if (this.isExpanded) core.shrink();
      else orbit.shrink();
    });

    core.onShrinkEnd(() => {
      orbit.expand();
    });

    orbit.onShrinkEnd(() => {
      core.expand();
    });

    this.add(orbit, core);
  }
}

export default CittaSolarSystem;
