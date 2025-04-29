import { palette } from "@/shared/palette";
import Konva from "konva";
import CittaSolarSystem from "./CittaSolarSystem";
import Constants from "@/config/constant";
import { cittaMap, getCittaCombination } from "@/entities/citta";
import store from "../lib/store";
import CloseButton from "@/shared/ui/CloseButton";
import { hideTooltip, showTooltip } from "@/shared/tooltip";
import { cetasikaMap } from "@/entities/cetasika";

class CittaPanel extends Konva.Group {
  expandTimer?: NodeJS.Timeout;

  _background: Konva.Rect;
  _solarSystem: CittaSolarSystem;
  _title: Konva.Text;
  _tweens: { title: Konva.Tween };

  _onClose: (e?: Konva.KonvaEventObject<MouseEvent>) => void = () => {};

  constructor(config: Konva.GroupConfig) {
    const {
      width = Constants.virtualSize.width,
      height = Constants.virtualSize.height,
      ...rest
    } = config;

    super({ opacity: 0, ...rest });
    super.hide();

    this._background = new Konva.Rect({
      width,
      height,
      opacity: 0.7,
      fill: palette.grays["950"],
    });

    this._solarSystem = new CittaSolarSystem({
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
    this._title = title;

    const closeBtn = new CloseButton({ y: 20 });
    closeBtn.x(width - closeBtn.width() - 20);

    this.add(this._background, title, this._solarSystem, closeBtn);

    const titleTween = new Konva.Tween({ node: this._title, opacity: 1 });
    this._tweens = { title: titleTween };

    // EVENT HANDLERS

    const handleClose = (e?: Konva.KonvaEventObject<MouseEvent>) => {
      clearTimeout(this.expandTimer);
      this.hide();
      this._onClose(e);
    };
    closeBtn.on("pointerclick", handleClose);
    this._background.on("pointerclick", handleClose);

    this._solarSystem.core.on("pointerout", () => hideTooltip());
    this._solarSystem.onExpand(() => {
      this._tweens.title.reverse();
    });
    this._solarSystem.onShrink(() => {
      this._tweens.title.play();
    });

    store.subscribe(
      (state) => ({ selectedCitta: state.selectedCitta, vedana: state.vedana }),
      (state) => {
        if (state.selectedCitta !== null) {
          const citta = cittaMap.get(state.selectedCitta);
          if (!citta)
            throw new Error(`Citta ${state.selectedCitta} is not defined`);

          this._title.setText(citta.name ?? citta.id);
          this._solarSystem.setCitta(citta.id);
          this.show();

          const combination = getCittaCombination(state.selectedCitta);
          if (!combination) return;
          this._solarSystem.orbit.setSatellites({
            must: combination.mustHave,
            sometime: combination.sometime,
            vedana: state.vedana,
            nodeEvents: [
              [
                "pointerover",
                (id, e) => {
                  this._solarSystem.orbit.revolveAnimation.stop();
                  const stage = e.target.getStage();
                  const orbit = this._solarSystem.orbit;
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
                  this._solarSystem.orbit.revolveAnimation.start();
                },
              ],
            ],
          });

          const renderCittaTooltip = () => {
            const thisPos = this.getPosition();
            const solarPos = this._solarSystem.getPosition();
            const position = {
              x: thisPos.x + solarPos.x,
              y: thisPos.y + solarPos.y,
            };
            if (this._solarSystem.isExpanded) {
              position.y += this._solarSystem.core.shrunkRadius;
              showTooltip({ position, text: "Citta" });
            } else {
              hideTooltip();
              // position.y += this._solarSystem.core.initialRadius;
              // const text =
              //   cittaMap.get(state.selectedCitta!)?.name ??
              //   state.selectedCitta!;
              // showTooltip({ position, text });
            }
          };

          this._solarSystem.core.on("pointerover", renderCittaTooltip);
          this._solarSystem.onClickCore(() => renderCittaTooltip());
        }
      }
    );

    // TESTS
    // setTimeout(() => store.getState().selectCitta("dosa1"), 500);
  }

  show() {
    super.show();
    this.to({ opacity: 1 });
    this.expandTimer = setTimeout(() => {
      this._solarSystem.expand();
    }, 800);
    return this;
  }

  hide() {
    this.to({
      opacity: 0,
      onFinish: () => {
        super.hide();
        this._solarSystem.shrink({ skipAnimation: true });
      },
    });
    return this;
  }

  onClose(callback: (e?: Konva.KonvaEventObject<MouseEvent>) => void) {
    this._onClose = callback;
  }
}

export default CittaPanel;
