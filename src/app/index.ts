import Konva from "konva";
import Router from "./router";

const routes = {
  "/": () => import("@/scenes/citta-sangaha"),
  "/vithi": () => import("@/scenes/vithi-design"),
};

class App {
  router: Router;

  constructor(stage: Konva.Stage) {
    const mainLayer = new Konva.Layer();
    stage.add(mainLayer);

    this.router = new Router(routes);
    this.router.onRouteChange((route) => {
      route().then(({ default: Scene }) => {
        const scene = new Scene();
        scene.attachToLayer(mainLayer);
      });
    });
  }
}

export default App;
