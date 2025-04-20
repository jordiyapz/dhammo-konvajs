import { TVisitor } from "@/shared/types";
import CetasikaTable from "../ui/CetasikaTable";
import store from "./store";

class CetasikaVisibilityVisitor implements TVisitor<CetasikaTable> {
  visit(table: CetasikaTable) {
    store.subscribe(
      ({ vedana, cetasikaList, sometimeCetasikaList }) => ({
        vedana,
        cetasikaList,
        sometimeCetasikaList,
      }),
      ({ cetasikaList, sometimeCetasikaList, vedana }) => {
        table._cetasikaNodes.forEach((cetasikaNode) => {
          const { id } = cetasikaNode;
          const isMust = cetasikaList.includes(id);
          const isSometime = sometimeCetasikaList.includes(id);
          const isVisible = isMust || isSometime;
          cetasikaNode.cetasika.visible(isVisible);
          // cetasikaNode.hitbox.visible(isVisible);

          if (id === "vedana") {
            cetasikaNode.cetasika.vedana = vedana;
          }
        });
      }
    );
  }
}

export default CetasikaVisibilityVisitor;
