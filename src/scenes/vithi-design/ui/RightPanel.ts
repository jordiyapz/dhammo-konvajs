import { palette } from "@/shared/palette";
import Konva from "konva";

class RightPanel extends Konva.Group {
  components: {
    bg: Konva.Rect;
    content: Konva.Group;
  } = {} as any;

  constructor(config: Konva.GroupConfig) {
    super(config);
    this.components.bg = new Konva.Rect({
      width: (config.width ?? 200) * -1,
      height: config.height,
      fill: palette.grays[800],
    });
    this.add(...Object.values(this.components));
  }
}

export default RightPanel;
