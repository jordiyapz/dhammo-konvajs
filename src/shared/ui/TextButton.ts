import Konva from "konva";
import { setCursorStyle } from "../utils";
import ButtonBase from "./ButtonBase";

type TextButtonProps = {
  text?: string;
};

class TextButton extends ButtonBase {
  constructor(config: Konva.GroupConfig & TextButtonProps) {
    super({ name: "text-button", ...config });

    const text = new Konva.Text({
      text: config.text ?? "Button",
      fontSize: 18,
      fontFamily: "Arial",
      align: "center",
      fill: "white",
    });
    this._baseNode.width(text.width() + 20);
    this._baseNode.height(text.height() + 10);
    text.x(this._baseNode.width() / 2 - text.width() / 2);
    text.y(this._baseNode.height() / 2 - text.height() / 2 + 2);
    this.width(this._baseNode.width());
    this.height(this._baseNode.height());

    this.add(this._baseNode, text);

    this.on("pointerover", function (e) {
      const stage = e.target.getStage();
      if (stage) setCursorStyle(stage, "pointer");
    });
    this.on("pointerout", function (e) {
      const stage = e.target.getStage();
      if (stage) setCursorStyle(stage, "default");
    });
  }
}

export default TextButton;
