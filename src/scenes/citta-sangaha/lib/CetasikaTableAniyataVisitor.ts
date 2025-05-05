import { TVisitor } from "@/shared/types";
import CetasikaTable from "../ui/CetasikaTable";
import store from "./store";

class CetasikaTableAniyataVisitor implements TVisitor<CetasikaTable> {
  visit(table: CetasikaTable) {
    store.subscribe(
      (s) => ({
        cetasikaList: s.cetasikaList,
        sometimeCetasikaList: s.sometimeCetasikaList,
        selectedCitta: s.selectedCitta,
      }),
      (state) => {
        table._cetasikaNodes.forEach((cetasikaNode) => {
          const { id, cetasika } = cetasikaNode;
          if (!state.selectedCitta) {
            cetasika.isAniyata = false;
            return;
          }
          const isMust = state.cetasikaList.includes(id);
          if (isMust) {
            cetasika.isAniyata = false;
            return;
          }
          const isSometime = state.sometimeCetasikaList.includes(id);
          if (isSometime) {
            cetasika.isAniyata = true;
          }
        });
      }
    );
  }
}

export default CetasikaTableAniyataVisitor;
