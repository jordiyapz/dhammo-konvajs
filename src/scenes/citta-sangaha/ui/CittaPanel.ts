import { palette } from "@/shared/palette";
import Konva from "konva";
import CittaSolarSystem from "./CittaSolarSystem";
import Constants from "@/config/constant";
import {
  AssociationRow,
  cittaMap,
  getCittaAsociation,
  getCittaCombination,
  UVedana,
} from "@/entities/citta";
import store from "../lib/store";
import CloseButton from "@/shared/ui/CloseButton";
import { hideTooltip, showTooltip } from "@/shared/tooltip";
import { cetasikaMap } from "@/entities/cetasika";
import TextButton from "@/shared/ui/TextButton";
import ArrowButton from "./ArrowButton";

class CittaPanel extends Konva.Group {
  expandTimer?: NodeJS.Timeout;

  _tweens: { title: Konva.Tween };

  _nodes: {
    backdrop: Konva.Rect;
    solarSystem: CittaSolarSystem;
    title: Konva.Text;
    closeBtn: CloseButton;
    leftBtn: ArrowButton;
    rightBtn: ArrowButton;
    showCombinationBtn: TextButton;
  };

  _onClose: (e?: Konva.KonvaEventObject<MouseEvent>) => void = () => {};

  constructor(config: Konva.GroupConfig) {
    const {
      width = Constants.virtualSize.width,
      height = Constants.virtualSize.height,
      ...rest
    } = config;

    super({ opacity: 0, ...rest });
    super.hide();

    const backdrop = new Konva.Rect({
      width,
      height,
      opacity: 0.7,
      fill: palette.grays["950"],
    });

    const solarSystem = new CittaSolarSystem({
      x: width / 2,
      y: height / 2,
      orbitOptions: { angularVelocity: 2, planetRadius: 10, minimalRadius: 50 },
    });

    const title = new Konva.Text({
      text: "Citta name",
      y: height / 2 + 60,
      width: width - 80,
      fontSize: 20,
      fill: "white",
      align: "center",
      opacity: 0,
    });
    title.x((width - title.width()) / 2);

    const closeBtn = new CloseButton({ y: 20 });
    closeBtn.x(width - closeBtn.width() - 20);

    const showCombinationBtn = new TextButton({
      text: "Show combination",
      y: height - 100,
      fontSize: 16,
      fill: "white",
      align: "center",
      opacity: 0.8,
    });
    this.width(width);
    showCombinationBtn.x((width - showCombinationBtn.width()) / 2);

    const leftBtn = new ArrowButton({ paddingY: 30, direction: "left" });
    leftBtn.x(20);
    leftBtn.y(height / 2 - leftBtn.height() / 2);
    leftBtn.hide();
    const rightBtn = new ArrowButton({ paddingY: 30, direction: "right" });
    rightBtn.x(width - rightBtn.width() - 20);
    rightBtn.y(height / 2 - rightBtn.height() / 2);
    rightBtn.hide();

    this._nodes = {
      backdrop,
      solarSystem,
      title,
      leftBtn,
      rightBtn,
      closeBtn,
      showCombinationBtn,
    };

    this.add(
      backdrop,
      title,
      solarSystem,
      showCombinationBtn,
      leftBtn,
      rightBtn,
      closeBtn
    );

    const titleTween = new Konva.Tween({ node: title, opacity: 1 });
    this._tweens = { title: titleTween };

    this.listen();

    // TESTS
    setTimeout(() => store.getState().selectCitta("dosa1"), 500);
  }

  listen() {
    const handleClose = (e?: Konva.KonvaEventObject<MouseEvent>) => {
      clearTimeout(this.expandTimer);
      this.hide();
      this._onClose(e);
    };
    this._nodes.closeBtn.on("pointerclick", handleClose);
    this._nodes.backdrop.on("pointerclick", handleClose);

    this._nodes.leftBtn.on("pointerclick", () => {
      const { activeCombinationIndex, setCombination } = store.getState();
      if (activeCombinationIndex !== null) {
        setCombination(Math.max(activeCombinationIndex - 1, 0));
      }
    });
    this._nodes.rightBtn.on("pointerclick", () => {
      const { activeCombinationIndex, setCombination, selectedCitta } =
        store.getState();
      if (activeCombinationIndex !== null && selectedCitta) {
        const combinations = getCittaCombination(selectedCitta);
        if (!combinations) return;
        setCombination(
          Math.min(activeCombinationIndex + 1, combinations.length - 1)
        );
      }
    });

    this._nodes.solarSystem.core.on("pointerout", () => hideTooltip());
    this._nodes.solarSystem.onExpand(() => {
      this._tweens.title.reverse();
    });
    this._nodes.solarSystem.onShrink(() => {
      this._tweens.title.play();
    });

    this._nodes.showCombinationBtn.on("pointerclick", () => {
      const { selectedCitta, activeCombinationIndex, setCombination } =
        store.getState();
      if (!selectedCitta) return;

      if (activeCombinationIndex !== null) {
        setCombination(null);
        return;
      }

      const combinations = getCittaCombination(selectedCitta);
      if (combinations) setCombination(0);
    });

    // Listen for changes in the selected citta
    store.subscribe(
      ({ selectedCitta, vedana }) => ({
        selectedCitta,
        vedana,
      }),
      (state, prev) => {
        if (
          state.selectedCitta !== prev.selectedCitta &&
          state.selectedCitta !== null
        ) {
          const citta = cittaMap.get(state.selectedCitta);
          if (!citta)
            throw new Error(`Citta ${state.selectedCitta} is not defined`);

          this._nodes.title.setText(citta.name ?? citta.id);
          this._nodes.solarSystem.setCitta(citta.id);
          this.show();

          const association = getCittaAsociation(state.selectedCitta);
          if (!association) return;

          this.updateSolarSystemSatellite(association, state.vedana);

          const renderCittaTooltip = () => {
            const thisPos = this.getPosition();
            const solarPos = this._nodes.solarSystem.getPosition();
            const position = {
              x: thisPos.x + solarPos.x,
              y: thisPos.y + solarPos.y,
            };
            if (this._nodes.solarSystem.isExpanded) {
              position.y += this._nodes.solarSystem.core.shrunkRadius;
              showTooltip({ position, text: "Citta" });
            } else {
              hideTooltip();
              // position.y += this._nodes.solarSystem.core.initialRadius;
              // const text =
              //   cittaMap.get(state.selectedCitta!)?.name ??
              //   state.selectedCitta!;
              // showTooltip({ position, text });
            }
          };

          this._nodes.solarSystem.core.on("pointerover", renderCittaTooltip);
          this._nodes.solarSystem.onClickCore(() => renderCittaTooltip());

          const combinations = getCittaCombination(state.selectedCitta);
          if (combinations) this._nodes.showCombinationBtn.show();
          else this._nodes.showCombinationBtn.hide();
        }
      }
    );

    // Listen for changes in active combination
    store.subscribe(
      ({ activeCombinationIndex, selectedCitta, vedana }) => ({
        activeCombinationIndex,
        selectedCitta,
        vedana,
      }),
      (state, prev) => {
        if (state.activeCombinationIndex === prev.activeCombinationIndex)
          return;

        const association = getCittaAsociation(state.selectedCitta!);

        if (state.activeCombinationIndex !== null) {
          this._nodes.showCombinationBtn.setText("Don't show combination");
          this._nodes.showCombinationBtn.x(
            this.width() / 2 - this._nodes.showCombinationBtn.width() / 2
          );

          this._nodes.leftBtn.show();
          this._nodes.rightBtn.show();

          const combinations = getCittaCombination(state.selectedCitta!);
          this.updateSolarSystemSatellite(
            {
              mustHave: [
                ...association!.mustHave,
                ...combinations![state.activeCombinationIndex!],
              ],
              sometime: [],
            },
            state.vedana
          );
        } else {
          this._nodes.showCombinationBtn.setText("Show combination");
          this._nodes.showCombinationBtn.x(
            this.width() / 2 - this._nodes.showCombinationBtn.width() / 2
          );
          this._nodes.leftBtn.hide();
          this._nodes.rightBtn.hide();

          this.updateSolarSystemSatellite(association!, state.vedana);
        }
      }
    );
  }

  show() {
    super.show();
    this.to({ opacity: 1 });
    this.expandTimer = setTimeout(() => {
      this._nodes.solarSystem.expand();
    }, 800);
    return this;
  }

  hide() {
    this.to({
      opacity: 0,
      onFinish: () => {
        super.hide();
        this._nodes.solarSystem.shrink({ skipAnimation: true });
      },
    });
    return this;
  }

  onClose(callback: (e?: Konva.KonvaEventObject<MouseEvent>) => void) {
    this._onClose = callback;
  }

  updateSolarSystemSatellite(
    association: Pick<AssociationRow, "mustHave" | "sometime">,
    vedana: UVedana
  ) {
    this._nodes.solarSystem.orbit.setSatellites({
      must: association.mustHave,
      sometime: association.sometime,
      vedana,
      nodeEvents: [
        [
          "pointerover",
          (id, e) => {
            this._nodes.solarSystem.orbit.revolveAnimation.stop();
            const stage = e.target.getStage();
            const orbit = this._nodes.solarSystem.orbit;
            if (stage) {
              const satellitePosition = e.currentTarget.getPosition();
              const orbitPos = orbit.getAbsolutePosition(stage);
              const orbitRotation =
                (orbit.getAbsoluteRotation() * Math.PI) / 180;
              const satelliteAngle =
                Math.atan(satellitePosition.y / satellitePosition.x) +
                (satellitePosition.x >= 0 ? 0 : Math.PI);

              const targetAngle = satelliteAngle + orbitRotation;
              const pointer = {
                x: orbitPos.x + orbit.orbitRadius * Math.cos(targetAngle),
                y:
                  orbitPos.y +
                  orbit.orbitRadius * Math.sin(targetAngle) +
                  orbit.planetRadius,
              };

              showTooltip({
                position: pointer,
                text: cetasikaMap.get(id)?.name,
              });
            }
          },
        ],
        [
          "pointerout",
          () => {
            hideTooltip();
            this._nodes.solarSystem.orbit.revolveAnimation.start();
          },
        ],
      ],
    });
  }
}

export default CittaPanel;
