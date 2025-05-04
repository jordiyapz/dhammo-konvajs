import Konva from "konva";
import ButtonBase from "./ButtonBase";

export type ContainerButtonProps = Konva.GroupConfig & {
  child?: Konva.Group | Konva.Shape;
  paddingX?: number;
  paddingY?: number;
};

class ContainerButton extends ButtonBase {
  _child?: Konva.Group | Konva.Shape;
  _paddingX: number = 10;
  _paddingY: number = 10;

  constructor(config: ContainerButtonProps) {
    super(config);
    this._paddingX = config.paddingX ?? this._paddingX;
    this._paddingY = config.paddingY ?? this._paddingY;
    this._child = config.child;
    if (!this._child) return;
    this.add(this._child);
    this._resizeSelf();
  }

  setChild(child: Konva.Group | Konva.Shape) {
    this._child?.remove();
    this._child = child;
    this.add(this._child);
    this._resizeSelf();
  }

  _resizeSelf() {
    if (!this._child) return;
    this._child.x(this._paddingX);
    this._child.y(this._paddingY);
    this._baseNode.width(this._child.width() + this._paddingX * 2);
    this._baseNode.height(this._child.height() + this._paddingY * 2);
    this.width(this._baseNode.width());
    this.height(this._baseNode.height());
  }
}

export default ContainerButton;
