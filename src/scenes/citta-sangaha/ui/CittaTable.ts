import Konva from "konva";
import { NamaContainer } from "@/entities/nama";
import {
  cittaFactory,
  CittaID,
  cittaIdList,
  cittaLayoutGroups,
  getCittaById,
} from "@/entities/citta";
import { setCursorStyle } from "@/shared/utils";
import { TVisitor } from "@/shared/types";

type CittaTableProps = {
  cittaRadius?: number;
};

class CittaTable extends Konva.Group {
  _cittaList: CittaID[] = cittaIdList;
  _cittaNodes: Array<{ id: CittaID; citta: any; hitbox: Konva.Circle }> = [];

  _onClickCitta: (id: CittaID) => void = () => {};

  constructor(config: Konva.GroupConfig & CittaTableProps = {}) {
    super({ name: "citta-table", ...config });

    const { cittaRadius = 18 } = config;

    const gap = 12;
    const cittaSpacing = cittaRadius * 2 + gap;

    let offsetX = 0;
    let offsetY = 0;

    for (const group of cittaLayoutGroups) {
      let rowCount = 0;
      for (const item of group) {
        const cittaNode = cittaFactory.createById(item.id, {
          x: item.x * cittaSpacing + offsetX,
          y: item.y * cittaSpacing + offsetY,
          radius: cittaRadius,
        });

        const container = new NamaContainer({
          jati: getCittaById(item.id)?.jati,
        });

        container.attachItem(cittaNode, { fitContainerToItem: true });
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
        hitbox.on("pointerclick", () => {
          this._onClickCitta(item.id);
        });

        this.add(container, hitbox);
        this._cittaNodes.push({
          id: item.id,
          citta: cittaNode,
          hitbox: hitbox,
        });

        rowCount = Math.max(rowCount, item.y + 1);
      }
      offsetY += rowCount * cittaSpacing + gap;
    }
    this.height(offsetY);
  }

  setAvailableCittas(availableCittas: CittaID[]) {
    this._cittaList = availableCittas;

    for (const { id, citta, hitbox } of this._cittaNodes) {
      const isActive = availableCittas.includes(id);
      hitbox.listening(isActive);
      citta.visible(isActive);
    }
  }

  onClickCitta(callback: (id: CittaID) => void) {
    this._onClickCitta = callback;
  }

  accept(visitor: TVisitor<CittaTable>) {
    visitor.visit(this);
  }
}

export default CittaTable;
