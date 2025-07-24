import Constants from "@/config/constant";
import RightPanel from "./ui/RightPanel";
import Konva from "konva";
import { palette } from "@/shared/palette";
import Canvas from "./ui/Canvas";

class VithiDesignScene {
  components: {
    bg: Konva.Rect;
    rightPanel: RightPanel;
    canvas: Canvas;
  } = {} as any;

  constructor() {
    this.components.bg = new Konva.Rect({
      width: Constants.virtualSize.width,
      height: Constants.virtualSize.height,
      fill: palette.backgroundGray,
    });
    this.components.rightPanel = new RightPanel({
      x: Constants.virtualSize.width,
      width: 200,
      height: Constants.virtualSize.height,
    });
    this.components.canvas = new Canvas({
      width: Constants.virtualSize.width - 200,
      height: Constants.virtualSize.height,
    })
    
  }
  attachToLayer(layer: Konva.Layer) {
    layer.add(...Object.values(this.components));
  }
}

export default VithiDesignScene;
