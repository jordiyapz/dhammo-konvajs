import Konva from "konva";
import { hideTooltip, showTooltip } from "@/shared/tooltip";
import ScrollablePanel from "@/shared/ui/ScrollablePanel";

import store from "../lib/store";
import CittaTable from "./CittaTable";
import CittaVisibilityVisitor from "../lib/CittaVisibilityVisitor";

const cittaRadius = 18;
const cittaTableInitialPosition = { x: 50, y: 40 };

class CittaPanel extends Konva.Group {
  constructor(config: Konva.GroupConfig) {
    super(config);

    const cittaTable = new CittaTable({
      ...cittaTableInitialPosition,
      cittaRadius,
    });
    cittaTable.setAvailableCittas(store.getState().cittaList);
    cittaTable.accept(new CittaVisibilityVisitor());

    const scrollablePanel = new ScrollablePanel({
      viewWidth: this.width(),
      viewHeight: this.height(),
      contentHeight: cittaTable.height() + cittaTableInitialPosition.y,
    });
    scrollablePanel.addContent(cittaTable);

    this.add(scrollablePanel);

    // EVENT HANDLERS

    const { selectCitta } = store.getState();

    cittaTable.on("pointerout dragstart", () => {
      hideTooltip();
    });
    cittaTable.on("pointerover", (e) => {
      const { x, y, name: targetName } = e.target.attrs;
      const words = targetName.split(" ");
      if (words.length == 2) {
        const [_, id] = words;
        const stage = e.target.getStage();
        const abs = cittaTable.getAbsolutePosition(stage ?? undefined);
        showTooltip({
          text: id,
          position: { x: x + abs.x, y: y + abs.y + cittaRadius },
        });
      }
    });
    cittaTable.onClickCitta((id) => {
      hideTooltip();
      selectCitta(id);
    });
    scrollablePanel.onScroll(() => {
      hideTooltip();
    });
  }
}

export default CittaPanel;
