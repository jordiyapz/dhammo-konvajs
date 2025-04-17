import { Vector2d } from "konva/lib/types";
import { createStore } from "zustand/vanilla";

type TooltipStore = {
  visible: boolean;
  position: Vector2d;
  text: string;
  show: (position?: Vector2d, text?: string) => void;
  hide: () => void;
};

export const tooltipStore = createStore<TooltipStore>()((set) => ({
  visible: false,
  position: { x: 0, y: 0 },
  text: "",
  show: (position?: Vector2d, text?: string) =>
    set((state) => ({
      visible: true,
      position: position || state.position,
      text: text || state.text,
    })),
  hide: () => set({ visible: false }),
}));

export const showTooltip = (options?: {
  position?: Vector2d;
  text?: string;
}) => {
  tooltipStore.getState().show(options?.position, options?.text);
};

export const hideTooltip = () => {
  tooltipStore.getState().hide();
};
