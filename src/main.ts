import "./style.css";

import Konva from "konva";

import { fitStageIntoParentContainer } from "./shared/utils";
import Constants from "./config/constant";
import CittaEditorScene from "./scenes/citta-editor";
import CittaSangahaScene from "./scenes/citta-sangaha";

// We need to create a stage
var stage = new Konva.Stage({
  container: "app", // id of container <div>
  width: Constants.virtualSize.width,
  height: Constants.virtualSize.height,
});

fitStageIntoParentContainer({
  elementId: "app",
  stage,
  virtualWidth: Constants.virtualSize.width,
  virtualHeight: Constants.virtualSize.height,
});

// Adapt the stage on window resize
window.addEventListener("resize", () =>
  fitStageIntoParentContainer({
    elementId: "app",
    stage,
    virtualWidth: Constants.virtualSize.width,
    virtualHeight: Constants.virtualSize.height,
  })
);

// then create layer
var layer = new Konva.Layer();

const scene = new CittaSangahaScene();
scene.attachToLayer(layer);

// add the layer to the stage
stage.add(layer);
