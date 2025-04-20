import Konva from "konva";
import { CittaNode } from "@/entities/citta";
import { NamaContainer, UJati } from "@/entities/nama";
import Constants from "@/config/constant";
import { palette } from "@/shared/palette";

class CittaEditorScene {
  background: any;
  configPanel: any;
  cittaContainer: NamaContainer;
  jati: UJati = "akusala";
  panelWidth = 0.4 * Constants.virtualSize.width;

  constructor() {
    this.background = new Konva.Rect({
      x: 0,
      y: 0,
      width: Constants.virtualSize.width,
      height: Constants.virtualSize.height,
      fill: palette.grays[900],
    });

    this.configPanel = new Konva.Group({
      x: 0,
      y: 0,
    });

    const panelBackground = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.panelWidth,
      height: Constants.virtualSize.height,
      fill: palette.grays[700],
    });

    this.configPanel.add(panelBackground);

    const cittaNode = new CittaNode({
      x: this.panelWidth + (Constants.virtualSize.width - this.panelWidth) / 2,
      y: Constants.virtualSize.height / 2,
      hetuVariant: "tihetuka",
    });

    this.cittaContainer = new NamaContainer({
      jati: this.jati,
    });

    this.cittaContainer.attachItem(cittaNode, { fitContainerToItem: true });
    // <input
    // type="range" min="1" max="10"
    // value={val}
    // onChange={(e)=>{
    //   setVal(e.target.value)
    // }} />

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "1";
    slider.max = "10";
    slider.value = "1";
    slider.onchange = (e: any) => {
      cittaNode.radius = e.target.value;
    };
    // this.configPanel.add(slider);
    document.body.appendChild(slider);
  }

  attachToLayer(layer: Konva.Layer) {
    layer.add(this.background, this.cittaContainer, this.configPanel);
  }
}

export default CittaEditorScene;
