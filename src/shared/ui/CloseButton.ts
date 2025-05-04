import Konva from "konva";
import { setCursorStyle } from "../utils";
import { palette } from "../palette";
import ButtonBase from "./ButtonBase";

const Defaults = { size: 30 };

class CloseButton extends ButtonBase {
  constructor(options: Konva.GroupConfig) {
    super({
      name: "close-button",
      ...options,
      width: Defaults.size,
      height: Defaults.size,
    });

    this._baseNode.width(Defaults.size);
    this._baseNode.height(Defaults.size);

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

    super.add(line1, line2);
  }
}

export default CloseButton;
