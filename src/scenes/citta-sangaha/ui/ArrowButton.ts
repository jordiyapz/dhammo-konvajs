import ContainerButton, {
  ContainerButtonProps,
} from "@/shared/ui/ContainerButton";
import Konva from "konva";

class ArrowButton extends ContainerButton {
  constructor(
    config: ContainerButtonProps & {
      direction: "up" | "down" | "left" | "right";
    }
  ) {
    super(config);
    const arrow = new Konva.RegularPolygon({
      sides: 3,
      radius: 10,
      fill: "white",
    });

    switch (config.direction) {
      case "up":
        arrow.rotation(0);
        break;
      case "down":
        arrow.rotation(180);
        break;
      case "left":
        arrow.rotation(-90);
        break;
      case "right":
        arrow.rotation(90);
        break;
    }
    arrow.x(arrow.width() / 2);
    arrow.y(arrow.height() / 2);

    const group = new Konva.Group({
      width: arrow.width(),
      height: arrow.height(),
    });
    group.add(arrow);
    this.setChild(group);
  }
}

export default ArrowButton;
