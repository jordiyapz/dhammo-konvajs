import Konva from "konva";
import CittaTable from "./CittaTable";
import store from "../lib/store";
import { hideTooltip, showTooltip } from "@/shared/tooltip";
import { cetasikaMap } from "@/entities/cetasika";
import Constants from "@/config/constant";

const PADDING = 5;

class CittaPanel extends Konva.Group {
  constructor(config: Konva.GroupConfig) {
    super(config);

    const panelWidth = this.width();
    const panelHeight = Constants.virtualSize.height;

    // For scroll hit region
    const transparentBg = new Konva.Rect({
      width: panelWidth,
      height: panelHeight,
    });

    const cittaRadius = 18;
    const cittaTableInitialPosition = { x: 50, y: 40 };

    const cittaTable = new CittaTable({
      ...cittaTableInitialPosition,
      cittaRadius,
    });
    cittaTable.setAvailableCittas(store.getState().cittaList);

    const panelContent = new Konva.Group({
      width: panelWidth - PADDING * 2 - 10,
      height: cittaTable.height() + cittaTableInitialPosition.y,
      draggable: true,
    });
    const contentBg = new Konva.Rect({
      width: panelContent.width(),
      height: panelContent.height(),
    });
    panelContent.add(contentBg, cittaTable);

    const verticalBar = new Konva.Rect({
      width: 10,
      height: 100,
      fill: "grey",
      opacity: 0.8,
      x: panelWidth - PADDING - 10,
      y: PADDING,
      draggable: true,
    });

    this.add(transparentBg, panelContent, verticalBar);

    const { selectCitta } = store.getState();

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
            x: x + panelContent.x() + cittaTable.x(),
            y: y + panelContent.y() + cittaTable.y() + cittaRadius,
          },
        });
      }
    });

    cittaTable.onClickCitta((id) => {
      hideTooltip();
      selectCitta(id);
    });

    verticalBar.on("dragmove", () => {
      // Constraint verticalBar movement
      verticalBar.x(panelWidth - PADDING - 10);
      verticalBar.y(
        Math.max(
          Math.min(
            verticalBar.y(),
            panelHeight - verticalBar.height() - PADDING
          ),
          PADDING
        )
      );

      const availableHeight = panelHeight - PADDING * 2 - verticalBar.height();
      const delta = (verticalBar.y() - PADDING) / availableHeight; // delta in %

      panelContent.y(-(panelContent.height() - panelHeight) * delta);
    });

    this.on("wheel", (e) => {
      e.evt.preventDefault();
      hideTooltip();

      const dy = e.evt.deltaY;
      const minY = -(panelContent.height() - panelHeight);
      const maxY = 0;
      const y = Math.max(minY, Math.min(panelContent.y() - dy, maxY));
      panelContent.y(y);

      const availableHeight = panelHeight - PADDING * 2 - verticalBar.height();
      const vy =
        (panelContent.y() / (-panelContent.height() + panelHeight)) *
          availableHeight +
        PADDING;

      verticalBar.y(vy);
    });

    panelContent.on("dragmove", () => {
      panelContent.x(0);

      const minY = -(panelContent.height() - panelHeight);
      const maxY = 0;
      const y = Math.max(minY, Math.min(panelContent.y(), maxY));
      if (y !== panelContent.y()) hideTooltip();
      panelContent.y(y);

      const availableHeight = panelHeight - PADDING * 2 - verticalBar.height();
      const vy =
        (panelContent.y() / (-panelContent.height() + panelHeight)) *
          availableHeight +
        PADDING;

      verticalBar.y(vy);
    });
  }
}

export default CittaPanel;
