import Konva from "konva";
import Row from "./Row";

class Canvas extends Konva.Group {
  components: {
    objectRow: Row;
    vithiRow: Row;
    pasada1Row: Row;
    pasada2Row: Row;
  } = {} as any;

  constructor(config: Konva.GroupConfig) {
    config.width = config.width ?? 400;
    super(config);
    this.components.objectRow = new Row({ x: config.width - 40, y: 50 });
    this.components.vithiRow = new Row({ x: config.width - 40, y: 180 });
    this.components.pasada1Row = new Row({ x: config.width - 40, y: 310 });
    this.components.pasada2Row = new Row({ x: config.width - 40, y: 440 });
    this.add(...Object.values(this.components));
  }
}

export default Canvas;
