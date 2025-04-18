import { TVisitor } from "@/shared/types";
import CetasikaTable from "../ui/CetasikaTable";
import store from "./store";

class CetasikaVisibilityVisitor implements TVisitor<CetasikaTable> {
  visit(table: CetasikaTable) {
    store.subscribe(
      ({ selectedCetasika, cetasikaList, sometimeCetasikaList }) => ({
        selectedCetasika,
        cetasikaList,
        sometimeCetasikaList,
      }),
      ({ cetasikaList, sometimeCetasikaList }) => {
        table._cetasikaNodes.forEach((cetasikaNode) => {
          const { id } = cetasikaNode;
          const isMust = cetasikaList.includes(id);
          const isSometime = sometimeCetasikaList.includes(id);
          const isVisible = isMust || isSometime;
          cetasikaNode.cetasika.visible(isVisible);
          // cetasikaNode.hitbox.visible(isVisible);
        });
      }
    );
  }
}

export default CetasikaVisibilityVisitor;
