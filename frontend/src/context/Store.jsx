import { create } from "zustand";

export const apiURL =
  window.location.hostname === "localhost"
    ? "http://localhost:8051"
    : "https://hospital-hr3.onrender.com";

const useBearStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));

export default useBearStore;
