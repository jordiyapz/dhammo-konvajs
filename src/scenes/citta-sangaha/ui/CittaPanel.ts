import Konva from "konva";
import CittaTable from "./CittaTable";
import store from "../lib/store";
import { hideTooltip, showTooltip } from "@/shared/tooltip";
import { cetasikaMap } from "@/entities/cetasika";

class CittaPanel extends Konva.Group {
  constructor(config: Konva.GroupConfig) {
    super(config);

    const cittaRadius = 18;
    const cittaTableInitialPosition = { x: 50, y: 40 };

    const cittaTable = new CittaTable({
      ...cittaTableInitialPosition,
      cittaRadius,
      draggable: true,
    });
    cittaTable.setAvailableCittas(store.getState().cittaList);

    this.add(cittaTable);
    
    const { selectCitta } = store.getState();

    cittaTable.on("dragend", (e) => {
      e.target.x(cittaTableInitialPosition.x);
    });
    cittaTable.on("pointerout dragstart", () => {
      hideTooltip();
    });
    cittaTable.on("pointerover", (e) => {
      const { x, y, name: targetName } = e.target.attrs;
      const words = targetName.split(" ");
      if (words.length == 2) {
        const [_, id] = words;
        const cetasika = cetasikaMap.get(id);
        showTooltip({
          text: cetasika?.name ?? id,
          position: {
            x: x + cittaTable.x(),
            y: y + cittaTable.y() +cittaRadius,
          },
        });
      }
    });

    cittaTable.onClickCitta((id) => {
      hideTooltip();
      selectCitta(id);
    });
  }
}

export default CittaPanel;
