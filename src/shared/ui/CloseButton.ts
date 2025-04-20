import Konva from "konva";
import { setCursorStyle } from "../utils";
import { palette } from "../palette";

const Defaults = { size: 30 };

class CloseButton extends Konva.Group {
  constructor(options: Konva.GroupConfig) {
    super({
      name: "close-button",
      ...options,
      width: Defaults.size,
      height: Defaults.size,
    });
    const base = new Konva.Rect({
      width: Defaults.size, // use scale to change size (to be implemented)
      height: Defaults.size,
      fill: palette.grays[800],
      stroke: palette.grays[600],
      strokeWidth: 1,
      shadowColor: "black",
      shadowBlur: 4,
      shadowOffsetX: 4,
      shadowOffsetY: 4,
      shadowOpacity: 0.2,
      cornerRadius: 4,
      opacity: 0.8,
    });
    const line1 = new Konva.Line({
      points: [6, 6, 24, 24],
      stroke: palette.grays[400],
      strokeWidth: 3,
      lineCap: "round",
    });
    const line2 = new Konva.Line({
      points: [24, 6, 6, 24],
      stroke: palette.grays[400],
      strokeWidth: 3,
      lineCap: "round",
    });

    this.add(base, line1, line2);

    // EVENT HANDLERS
    this.on("pointerover", function (e) {
      const stage = e.target.getStage();
      if (stage) setCursorStyle(stage, "pointer");
      base.opacity(1);
    });
    this.on("pointerout", function (e) {
      const stage = e.target.getStage();
      if (stage) setCursorStyle(stage, "default");
      base.opacity(.8);
    });
  }
}

export default CloseButton;
