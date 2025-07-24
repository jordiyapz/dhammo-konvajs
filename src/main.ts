import "./style.css";

import Konva from "konva";

import Constants from "./config/constant";
import { fitStageBestFit } from "./shared/utils";
import App from "./app";

const containerId = "app";

function resizeStage(stage: Konva.Stage) {
  fitStageBestFit({
    elementId: containerId,
    stage,
    virtualWidth: Constants.virtualSize.width,
    virtualHeight: Constants.virtualSize.height,
  });
}

// We need to create a stage
var stage = new Konva.Stage({
  container: containerId, // id of container <div>
  width: Constants.virtualSize.width,
  height: Constants.virtualSize.height,
});

window.addEventListener("load", function () {
  // Code to run when the entire page is fully loaded
  resizeStage(stage);
  resizeStage(stage);
});
window.addEventListener("resize", () => {
  // Adapt the stage on window resize
  resizeStage(stage);
});

new App(stage);