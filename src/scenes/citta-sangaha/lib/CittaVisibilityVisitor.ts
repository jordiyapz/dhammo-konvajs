import { TVisitor } from "@/shared/types";
import store from "./store";
import CittaTable from "../ui/CittaTable";

class CittaVisibilityVisitor implements TVisitor<CittaTable> {
  visit(table: CittaTable) {
    store.subscribe(
      ({ cittaList }) => ({ cittaList }),
      ({ cittaList }) => {
        table._cittaNodes.forEach((cittaNode) => {
          const { id } = cittaNode;
          const isVisible = cittaList.includes(id);
          cittaNode.citta.visible(isVisible);
          // cittaNode.hitbox.visible(isVisible);
        });
      }
    );
  }
}

export default CittaVisibilityVisitor;
