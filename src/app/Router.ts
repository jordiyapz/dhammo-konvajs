type Route = () => Promise<any>;

class Router {
  routeChangeCb?: (route: Route) => void;

  constructor(
    private routes: Record<string, Route>,
    private containerId: string = "app"
  ) {
    window.addEventListener("hashchange", this.handleRouteChange.bind(this));
    this.handleRouteChange();
  }

  handleRouteChange() {
    const path = window.location.pathname;
    if (!Object.keys(this.routes).includes(path)) {
      const mainDiv = document.getElementById(this.containerId);
      if (mainDiv) {
        mainDiv.style.color = "white";
        mainDiv.innerHTML =
          "<h1>404 Not Found</h1><p>The page you are looking for does not exist.</p>";
      }
      return;
    }
    const route = this.routes[path] || this.routes["/"];
    this.routeChangeCb?.(route);
  }

  onRouteChange(callback: (route: Route) => void) {
    this.routeChangeCb = callback;
    this.handleRouteChange();
  }
}

export default Router;
