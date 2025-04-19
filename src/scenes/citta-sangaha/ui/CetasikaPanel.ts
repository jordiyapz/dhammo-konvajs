import Konva from "konva";
import { hideTooltip, showTooltip } from "@/shared/tooltip";
import ScrollablePanel from "@/shared/ui/ScrollablePanel";
import {
  CetasikaFactory,
  cetasikaFactory,
  cetasikaMap,
  CetasikaNode,
} from "@/entities/cetasika";
import CetasikaTable from "./CetasikaTable";
import CetasikaVisibilityVisitor from "../lib/CetasikaVisibilityVisitor";
import store from "../lib/store";
import { palette } from "@/shared/palette";

const cetasikaRadius = 16;

class CetasikaPanel extends Konva.Group {
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

    const backdrop = new Konva.Rect({
      width: scrollablePanel.contentNode.width(),
      height: this.height(),
      fill: palette.grays[800],
      opacity: 0.7,
    });
    const selectedCetasikaNode = new CetasikaNode({
      x: backdrop.width() / 2,
      y: backdrop.height() / 2,
      radius: 24,
    });
    const cetasikaDialog = new Konva.Group();
    cetasikaDialog.add(backdrop, selectedCetasikaNode);
    cetasikaDialog.hide();

    this.add(scrollablePanel, cetasikaDialog);

    cetasikaTable.onClickCetasika((id, e) => {
      const { x, y } = e?.target.attrs ?? {};

      const state = store.getState();
      if (state.selectedCitta === null) {
        state.selectCetasika(id);
      }

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

    store.subscribe(
      ({ selectedCetasika }) => ({ selectedCetasika }),
      ({ selectedCetasika }) => {
        if (selectedCetasika === null) {
          cetasikaDialog.hide();
        } else {
          CetasikaFactory.modifyCetasika(
            selectedCetasikaNode,
            selectedCetasika,
            selectedCetasika === "vedana" ? store.getState().vedana : undefined
          );
          cetasikaDialog.show();
        }
      }
    );
  }
}

export default CetasikaPanel;
