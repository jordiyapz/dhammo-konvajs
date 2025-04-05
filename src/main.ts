import "./style.css";

import Konva from "konva";

import CittaSangahaScene from "./scenes/citta-sangaha";

// first we need to create a stage
var stage = new Konva.Stage({
  container: "app", // id of container <div>
  width: 1200,
  height: 600,
});

// then create layer
var layer = new Konva.Layer();

const cittaSangahaScene = new CittaSangahaScene(stage);
cittaSangahaScene.attachToLayer(layer);

// add the layer to the stage
stage.add(layer);
