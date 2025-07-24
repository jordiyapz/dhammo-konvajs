import Konva from "konva";
import Cell from "./Cell";

type TVisitor<T> = { visit: (node: T) => void };

class Row extends Konva.Group {
  cells: Konva.Group[] = [];

  constructor(config: Konva.GroupConfig) {
    super(config);
    this.cells = Array(10)
      .fill(null)
      .map((_, i) => {
        return new Cell({ x: -i * 84 + 10 - 70, y: 0, width: 70, height: 70 });
      });
    this.add(...this.cells);
  }

  accept<V extends TVisitor<Row>>(visitor: V) {
    visitor.visit(this);
  }
}

export default Row;
