import { create } from "zustand";
import axios from "axios";
export const apiURL =
  window.location.hostname === "localhost"
    ? "http://localhost:8053"
    : "https://hospital-hr3.onrender.com";

const useBearStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  userData: [],
  fetchUserData: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ error: "Token not found in localStorage", loading: false });
    }

    try {
      set({ loading: true });
      const response = await axios.get(`${apiURL}/api/user`, {
        headers: {
          token: token,
        },
      });
      console.log(response.data);
      set({ userData: response.data, loading: false, error: null });
    } catch (err) {
      set({ error: "Failed to fetch user data", loading: false });
      console.log(err?.response.data.message);
    }
  },
}));

export default useBearStore;
