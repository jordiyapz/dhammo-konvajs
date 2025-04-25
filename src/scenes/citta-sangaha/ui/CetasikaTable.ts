import Konva from "konva";
import { TVisitor } from "@/shared/types";
import { NamaContainer } from "@/entities/nama";
import {
  CetasikaID,
  CetasikaNode,
  cetasikaFactory,
  cetasikaLayoutGroups,
} from "@/entities/cetasika";
import { setCursorStyle } from "@/shared/utils";

type CetasikaTableProps = {
  cetasikaRadius?: number;
};

class CetasikaTable extends Konva.Group {
  cetasikaRadius = 8;
  _onClickCetasika?: (
    id: CetasikaID,
    e?: Konva.KonvaEventObject<PointerEvent>
  ) => void;
  _cetasikaNodes: Array<{
    id: CetasikaID;
    cetasika: CetasikaNode;
    hitbox: Konva.Circle;
  }> = [];

  constructor(config: Konva.GroupConfig & CetasikaTableProps = {}) {
    super({ name: "cetasika-table", ...config });

    const gap = 10;
    const groupGap = 6;
    this.cetasikaRadius = config.cetasikaRadius ?? this.cetasikaRadius;

    const cetasikaSpacing = this.cetasikaRadius * 2 + gap;

    let offsetX = 0;
    let offsetY = 0;

    for (const group of cetasikaLayoutGroups) {
      let rowCount = 0;
      for (const item of group) {
        const cetasikaNode = cetasikaFactory.createById(item.id, {
          x: item.x * cetasikaSpacing + offsetX,
          y: item.y * cetasikaSpacing + offsetY,
          radius: this.cetasikaRadius,
          vedana: "upekkha",
        });

        const container = new NamaContainer({ jati: "vipaka" });
        container.attachItem(cetasikaNode, { fitContainerToItem: true });

        const hitbox = new Konva.Circle({
          x: container.x(),
          y: container.y(),
          radius: container.radius,
          name: `hitbox ${item.id}`,
        });
        hitbox.on("pointerover", (e) => {
          const stage = e.target.getStage();
          if (stage) setCursorStyle(stage, "pointer");
        });
        hitbox.on("pointerout", (e) => {
          const stage = e.target.getStage();
          if (stage) setCursorStyle(stage, "default");
        });
        hitbox.on("pointerclick", (e) => {
          this._onClickCetasika?.(item.id, e);
        });
        this.add(container, hitbox);
        this._cetasikaNodes.push({
          id: item.id,
          cetasika: cetasikaNode,
          hitbox,
        });

        rowCount = Math.max(rowCount, item.y + 1);
      }
      offsetY += rowCount * cetasikaSpacing + groupGap;
    }
    this.height(offsetY);
  }

  accept<V extends TVisitor<CetasikaTable>>(visitor: V) {
    visitor.visit(this);
  }

  onClickCetasika(
    callback: (id: CetasikaID, e?: Konva.KonvaEventObject<PointerEvent>) => void
  ) {
    this._onClickCetasika = callback;
  }
}

export default CetasikaTable;
