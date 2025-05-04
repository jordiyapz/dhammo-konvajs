import Konva from "konva";
import { palette } from "../palette";
import { setCursorStyle } from "../utils";

class ButtonBase extends Konva.Group {
  _baseNode: Konva.Rect;

  constructor(config: Konva.GroupConfig) {
    super(config);
    this._baseNode = new Konva.Rect({
      fill: palette.grays["950"],
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
    this.add(this._baseNode);

    // EVENT HANDLERS
    this.on("pointerover", function (e) {
      const stage = e.target.getStage();
      if (stage) setCursorStyle(stage, "pointer");
      this._baseNode.opacity(1);
    });
    this.on("pointerout", function (e) {
      const stage = e.target.getStage();
      if (stage) setCursorStyle(stage, "default");
      this._baseNode.opacity(0.8);
    });
  }
}

export default ButtonBase;
