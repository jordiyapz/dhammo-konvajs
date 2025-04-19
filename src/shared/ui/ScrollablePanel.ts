import Konva from "konva";

type ScrollablePanelProps = {
  viewWidth: number;
  viewHeight: number;
  contentHeight: number;
  onScroll?: () => void;
};

const Defaults = {
  scrollbarPadding: 4,
  scrollbarWidth: 10,
  scrollbarMinHeight: 50,
};

class ScrollablePanel extends Konva.Group {
  _nodes: { content: Konva.Group };
  _onScroll?: () => void;

  constructor(config: Konva.GroupConfig & ScrollablePanelProps) {
    super({ name: "scrollable-panel", ...config });

    const { viewWidth, viewHeight, contentHeight } = config;
    this._onScroll = config.onScroll;

    // For scroll wheel hit region
    const panelBg = new Konva.Rect({
      width: viewWidth,
      height: viewHeight,
    });

    const panelContent = new Konva.Group({
      width: viewWidth - Defaults.scrollbarPadding * 2 - 10,
      height: contentHeight,
      draggable: true,
    });
    const contentBg = new Konva.Rect({
      width: panelContent.width(),
      height: panelContent.height(),
    });
    panelContent.add(contentBg);

    const verticalBarBg = new Konva.Rect({
      width: Defaults.scrollbarWidth,
      height: viewHeight - Defaults.scrollbarPadding * 2,
      fill: "grey",
      opacity: 0.2,
      x: viewWidth - Defaults.scrollbarPadding - 10,
      y: Defaults.scrollbarPadding,
      cornerRadius: Defaults.scrollbarWidth / 2,
    });
    const verticalBar = new Konva.Rect({
      width: verticalBarBg.width(),
      height: Math.max(
        Defaults.scrollbarMinHeight,
        (verticalBarBg.height() / contentHeight) * viewHeight
      ),
      fill: "grey",
      opacity: 0.6,
      x: verticalBarBg.x(),
      y: verticalBarBg.y(),
      draggable: true,
      cornerRadius: Defaults.scrollbarWidth / 2,
    });

    this.add(panelBg, panelContent, verticalBarBg, verticalBar);

    this._nodes = {
      content: panelContent,
    };

    // EVENT HANDLERS

    // For scroll wheel
    this.on("wheel", (e) => {
      e.evt.preventDefault();

      const dy = e.evt.deltaY;
      const minY = -(panelContent.height() - viewHeight);
      const maxY = 0;
      const y = Math.max(minY, Math.min(panelContent.y() - dy, maxY));
      panelContent.y(y);

      const availableHeight =
        viewHeight - Defaults.scrollbarPadding * 2 - verticalBar.height();
      const vy =
        (panelContent.y() / (-panelContent.height() + viewHeight)) *
          availableHeight +
        Defaults.scrollbarPadding;

      verticalBar.y(vy);

      this._onScroll?.();
    });

    // For mobile scroll
    panelContent.on("dragmove", () => {
      panelContent.x(0);

      const minY = -(panelContent.height() - viewHeight);
      const maxY = 0;
      const y = Math.max(minY, Math.min(panelContent.y(), maxY));
      panelContent.y(y);

      const availableHeight =
        viewHeight - Defaults.scrollbarPadding * 2 - verticalBar.height();
      const vy =
        (panelContent.y() / (-panelContent.height() + viewHeight)) *
          availableHeight +
        Defaults.scrollbarPadding;
      verticalBar.y(vy);

      this._onScroll?.();
    });

    // Simulate scrollbar
    verticalBar.on("dragmove", () => {
      // Constraint verticalBar movement
      verticalBar.x(viewWidth - Defaults.scrollbarPadding - 10);
      verticalBar.y(
        Math.max(
          Math.min(
            verticalBar.y(),
            viewHeight - verticalBar.height() - Defaults.scrollbarPadding
          ),
          Defaults.scrollbarPadding
        )
      );

      const availableHeight =
        viewHeight - Defaults.scrollbarPadding * 2 - verticalBar.height();
      const delta =
        (verticalBar.y() - Defaults.scrollbarPadding) / availableHeight; // delta in %

      panelContent.y(-(panelContent.height() - viewHeight) * delta);

      this._onScroll?.();
    });

    verticalBar.on("mouseover", () => {
      verticalBar.opacity(1);
    });
    verticalBar.on("mouseout", () => {
      verticalBar.opacity(0.6);
    });
  }

  addContent(...nodes: Array<Konva.Group | Konva.Shape>) {
    this._nodes.content.add(...nodes);
  }

  get contentNode() {
    return this._nodes.content;
  }

  onScroll(callback: () => void) {
    this._onScroll = callback;
  }
}

export default ScrollablePanel;
