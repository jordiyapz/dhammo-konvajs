import { palette } from "@/shared/palette";
import Konva from "konva";

const Defaults = {
  initialStroke: palette.grays[800],
  initialStrokeWidth: 2,
};

class Cell extends Konva.Group {
  components: { border: Konva.Rect } = {} as any;

  constructor(config: Konva.GroupConfig) {
    super(config);
    this.components.border = new Konva.Rect({
      width: config.width ?? 100,
      height: config.height ?? 100,
      stroke: Defaults.initialStroke,
      strokeWidth: Defaults.initialStrokeWidth,
      dash: [5, 5],
      fill: palette.grays[900],
    });
    this.components.border.on("pointerover", () => {
      this.components.border.stroke(palette.grays[600]);
      console.debug("pointerover");
    });
    this.components.border.on("pointerout", () => {
      this.components.border.strokeWidth(Defaults.initialStrokeWidth);
      this.components.border.stroke(Defaults.initialStroke);
    });
    this.add(...Object.values(this.components));
  }
}

export default Cell;
