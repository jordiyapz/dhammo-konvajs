import Konva from "konva";
import CetasikaTable from "./CetasikaTable";
import { hideTooltip, showTooltip } from "@/shared/tooltip";
import { cetasikaMap } from "@/entities/cetasika";
import store from "../lib/store";
import CetasikaVisibilityVisitor from "../lib/CetasikaVisibilityVisitor";

const cetasikaRadius = 16;
const offsetX = 40;

class CetasikaPanel extends Konva.Group {
  constructor(config: Konva.GroupConfig) {
    super(config);

    const cetasikaTable = new CetasikaTable({
      x: offsetX,
      y: 40,
      cetasikaRadius,
      draggable: true,
    });
    cetasikaTable.accept(new CetasikaVisibilityVisitor());

    this.add(cetasikaTable);

    cetasikaTable.onClickCetasika((id, e) => {
      const { x, y } = e?.target.attrs ?? {};
      showTooltip({
        text: cetasikaMap.get(id)?.name ?? id,
        position: {
          x: x + cetasikaTable.x() + this.x(),
          y: y + cetasikaTable.y() + this.y() + cetasikaRadius,
        },
      });
    });
    cetasikaTable.on("dragend", (e) => {
      e.target.x(offsetX);
    });
    cetasikaTable.on("pointerout dragstart", () => {
      hideTooltip();
    });
    cetasikaTable.on("pointerover", (e) => {
      const { x, y, name: targetName } = e.target.attrs;
      const words = targetName.split(" ");
      if (words.length == 2) {
        const [_, id] = words;
        const cetasika = cetasikaMap.get(id);
        showTooltip({
          text: cetasika?.name ?? id,
          position: {
            x: x + cetasikaTable.x() + this.x(),
            y: y + cetasikaTable.y() + this.y() + cetasikaRadius,
          },
        });
      }
    });

    // store.subscribe(
    //   ({ selectedCetasika, cetasikaList, sometimeCetasikaList }) => ({
    //     selectedCetasika,
    //     cetasikaList,
    //     sometimeCetasikaList,
    //   }),
    //   ({ cetasikaList, sometimeCetasikaList }) => {
    //     console.log(cetasikaList, sometimeCetasikaList);
    //   }
    // );
  }
}

export default CetasikaPanel;
