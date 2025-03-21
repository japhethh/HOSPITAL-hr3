import { create } from "zustand";

export const apiURL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://backend-logistic1.jjm-manufacturing.com";

const useBearStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));

export default useBearStore;
