import Konva from "konva";
import { palette } from "../palette";
import { setCursorStyle } from "../utils";

const Defaults = {
  initialOpacity: 0.8,
};

class ButtonBase extends Konva.Group {
  _baseNode: Konva.Rect;
  _disabled: boolean = false;
  _onClick: () => void = () => {};
  
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
      opacity: Defaults.initialOpacity,
    });
    this.add(this._baseNode);

    this.disabled = false;
  }

  set disabled(disabled: boolean) {
    this._disabled = disabled;
    this._baseNode.opacity(disabled ? 0.4 : Defaults.initialOpacity);
    if (disabled) {
      this.off("pointerover");
      this.off("pointerout");
      const stage = this.getStage();
      if (stage) setCursorStyle(stage, "default");
    } else {
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
}

export default ButtonBase;
