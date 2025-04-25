import { palette } from "@/shared/palette";
import Konva from "konva";
import { Vector2d } from "konva/lib/types";
import { tooltipStore } from "../tooltip";

class Tooltip extends Konva.Group {
  padding: Vector2d = { x: 8, y: 4 };

  _arrowSize = 4;
  _components: {
    text: Konva.Text;
    rect: Konva.Rect;
    arrow: Konva.RegularPolygon;
  };

  constructor(
    config: Konva.GroupConfig &
      Pick<Konva.TextConfig, "fontSize" | "fontFamily" | "align"> &
      Partial<{ textColor: Konva.TextConfig["fill"] }> = {}
  ) {
    super({ name: "tooltip", ...config });

    const {
      fontSize = 12,
      fontFamily = "Arial",
      align = "center",
      textColor = "white",
    } = config;

    this._arrowSize = 5;

    const state = tooltipStore.getState();

    this._components = {
      text: new Konva.Text({
        text: state.text,
        fontSize,
        fontFamily,
        align,
        fill: textColor,
      }),
      rect: new Konva.Rect({
        fill: palette.grays["950"],
        shadowColor: "black",
        shadowBlur: 4,
        shadowOffsetX: 4,
        shadowOffsetY: 4,
        shadowOpacity: 0.2,
        cornerRadius: 4,
      }),
      arrow: new Konva.RegularPolygon({
        sides: 3,
        radius: this._arrowSize,
        fill: palette.grays["950"],
        shadowColor: "black",
        shadowBlur: 4,
        shadowOffsetX: 4,
        shadowOffsetY: 4,
        shadowOpacity: 0.2,
      }),
    };
    const arrowHeight = this._arrowSize * (1 + Math.sin(Math.PI / 6));
    const boxYOffset = -1; // because arrow and box may have small gap

    const { rect, text, arrow } = this._components;
    arrow.y(this._arrowSize);
    text.y(arrowHeight + this.padding.y + boxYOffset);
    rect.y(arrowHeight + boxYOffset);

    this.add(arrow, rect, text);

    tooltipStore.subscribe((state) => {
      this.position(state.position);
      this._setText(state.text);
      if (state.visible) this.show();
      else this.hide();
    });
  }

  get text() {
    return tooltipStore.getState().text;
  }

  _setText(newText: string) {
    const { text, rect } = this._components;

    text.text(newText);

    const width = text.width() + this.padding.x * 2;
    const height = text.height() + this.padding.y * 2;
    text.x(-text.width() / 2);
    rect.x(-width / 2);
    rect.width(width);
    rect.height(height);
  }
}

export default Tooltip;
