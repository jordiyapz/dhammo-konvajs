import Konva from "konva";
import { palette } from "../palette";
import ContainerButton, { ContainerButtonProps } from "./ContainerButton";

const Defaults = { size: 30 };

class CloseButton extends ContainerButton {
  constructor(options: Omit<ContainerButtonProps, "child">) {
    super({
      name: "close-button",
      ...options,
      width: Defaults.size,
      height: Defaults.size,
      paddingX: 0,
      paddingY: 0,
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

    const group = new Konva.Group({
      width: Defaults.size,
      height: Defaults.size,
    });
    group.add(line1, line2);

    this.setChild(group);
  }
}

export default CloseButton;
