import Konva from "konva";

import Constants from "@/config/constant";
import Tooltip from "@/shared/ui/Tooltip";
import { palette } from "@/shared/palette";
import { hideTooltip } from "@/shared/tooltip";

import SolarPanel from "./ui/SolarPanel";
import store from "./lib/store";
import CetasikaPanel from "./ui/CetasikaPanel";
import CittaPanel from "./ui/CittaPanel";

const panelWidth = Constants.virtualSize.width / 2 + 50;

class CittaSangahaScene {
  components: any[] = [];

  constructor() {
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: Constants.virtualSize.width,
      height: Constants.virtualSize.height,
      fill: palette.backgroundGray,
    });

    const cittaPanel = new CittaPanel({
      width: panelWidth,
      height: Constants.virtualSize.height,
    });

    const verticalLine = new Konva.Line({
      points: [panelWidth, 0, panelWidth, Constants.virtualSize.height],
      stroke: palette.grays[600],
      strokeWidth: 1,
    });

    const cetasikaPanel = new CetasikaPanel({
      x: panelWidth,
      width: Constants.virtualSize.width - panelWidth,
      height: Constants.virtualSize.height,
    });

    const solarPanel = new SolarPanel({
      width: panelWidth,
      height: Constants.virtualSize.height,
    });

    const tooltip = new Tooltip({ fontSize: 16 });

    // EVENT LISTENERS
    const { selectCitta } = store.getState();

    solarPanel.onClose(() => {
      hideTooltip();
      selectCitta(null);
    });

    this.components.push(
      background,
      cittaPanel,
      verticalLine,
      cetasikaPanel,
      solarPanel,
      tooltip
    );
  }

  attachToLayer(layer: Konva.Layer) {
    layer.add(...this.components);
  }
}

export default CittaSangahaScene;
