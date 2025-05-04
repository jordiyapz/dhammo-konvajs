import Konva from "konva";
import { setCursorStyle } from "../utils";
import ButtonBase from "./ButtonBase";

type TextButtonProps = {
  text?: string;
};

class TextButton extends ButtonBase {
  _nodes: { text: Konva.Text };

  constructor(config: Konva.GroupConfig & TextButtonProps) {
    super({ name: "text-button", ...config });

    const text = new Konva.Text({
      fontSize: 18,
      fontFamily: "Arial",
      align: "center",
      fill: "white",
    });
    this._nodes = { text };
    this.add(this._baseNode, text);

    this.setText(config.text ?? "Button");

    this.on("pointerover", function (e) {
      const stage = e.target.getStage();
      if (stage) setCursorStyle(stage, "pointer");
    });
    this.on("pointerout", function (e) {
      const stage = e.target.getStage();
      if (stage) setCursorStyle(stage, "default");
    });
  }

  setText(newText: string) {
    const textNode = this._nodes?.text
    if (!textNode) return

    textNode.text(newText);
    this._baseNode.width(textNode.width() + 20);
    this._baseNode.height(textNode.height() + 10);
    textNode.x(this._baseNode.width() / 2 - textNode.width() / 2);
    textNode.y(this._baseNode.height() / 2 - textNode.height() / 2 + 2);
    this.width(this._baseNode.width());
    this.height(this._baseNode.height());
  }
}

export default TextButton;
