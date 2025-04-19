import Konva from "konva";
import { hideTooltip, showTooltip } from "@/shared/tooltip";
import ScrollablePanel from "@/shared/ui/ScrollablePanel";
import { cetasikaMap } from "@/entities/cetasika";
import CetasikaVisibilityVisitor from "../lib/CetasikaVisibilityVisitor";
import store from "../lib/store";
import CetasikaTable from "./CetasikaTable";
import CetasikaPanel from "./CetasikaPanel";

const cetasikaRadius = 16;

class CetasikaSection extends Konva.Group {
  constructor(config: Konva.GroupConfig) {
    super(config);

    const cetasikaTable = new CetasikaTable({
      x: 40,
      y: 40,
      cetasikaRadius,
    });
    cetasikaTable.accept(new CetasikaVisibilityVisitor());

    const scrollablePanel = new ScrollablePanel({
      viewWidth: this.width(),
      viewHeight: this.height(),
      contentHeight: cetasikaTable.height() + 40,
    });
    scrollablePanel.addContent(cetasikaTable);

    const cetasikaDialog = new CetasikaPanel({
      width: this.width(),
      height: this.height(),
      radius: cetasikaRadius,
    });
    this.add(scrollablePanel, cetasikaDialog);

    cetasikaTable.onClickCetasika((id, e) => {
      const state = store.getState();
      if (state.selectedCitta === null) {
        hideTooltip();
        state.selectCetasika(id);
      }

      const { x, y } = e?.target.attrs ?? {};
      const stage = e?.target.getStage();
      const absolute = cetasikaTable.getAbsolutePosition(stage ?? undefined);
      showTooltip({
        text: cetasikaMap.get(id)?.name ?? id,
        position: { x: x + absolute.x, y: y + absolute.y + cetasikaRadius },
      });
    });
    cetasikaTable.on("pointerout dragstart", () => {
      hideTooltip();
    });
    cetasikaTable.on("pointerover", (e) => {
      const { x, y, name: targetName } = e.target.attrs;
      const words = targetName.split(" ");
      if (words.length == 2) {
        const [_, id] = words;
        const stage = e.target.getStage();
        const absolute = cetasikaTable.getAbsolutePosition(stage ?? undefined);
        showTooltip({
          text: cetasikaMap.get(id)?.name ?? id,
          position: { x: x + absolute.x, y: y + absolute.y + cetasikaRadius },
        });
      }
    });

    cetasikaDialog.on("click", () => {
      store.getState().selectCetasika(null);
    });
  }
}

export default CetasikaSection;
