import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);
const REQUEST_TIMEOUT_MS = 12000;

function getErrorMessage(error) {
  if (error.response?.status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }
  if (error.code === "ECONNABORTED") {
    return "The server took too long to respond. Please try again.";
  }
  if (error.code === "ERR_NETWORK") {
    return `Cannot connect to the store API at ${BASE_URL}. Start the backend and try again.`;
  }
  return error.response?.data?.message || "Something went wrong. Please try again.";
}

const initialFormData = { name: "", price: "", image: "" };

export const useProductStore = create((set, get) => ({
  products: [],
  productsLoading: false,
  productLoading: false,
  adding: false,
  saving: false,
  deleting: false,
  error: null,
  currentProduct: null,
  formData: initialFormData,

  setFormData: (formData) =>
    set((state) => ({
      formData: typeof formData === "function" ? formData(state.formData) : formData,
    })),
  resetForm: () => set({ formData: { ...initialFormData } }),

  addProduct: async (event) => {
    event.preventDefault();
    set({ adding: true });

    try {
      await axios.post(`${BASE_URL}/api/products`, get().formData, {
        timeout: REQUEST_TIMEOUT_MS,
      });
      get().resetForm();
      document.getElementById("add_product_modal")?.close();
      toast.success("Product added successfully");
      await get().fetchProducts();
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    } finally {
      set({ adding: false });
    }
  },

  fetchProducts: async () => {
    set({ productsLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/products`, {
        timeout: REQUEST_TIMEOUT_MS,
      });
      if (!Array.isArray(response.data.data)) {
        throw new Error("The server returned an invalid product list.");
      }
      set({ products: response.data.data });
      return true;
    } catch (error) {
      set({ products: [], error: getErrorMessage(error) });
      return false;
    } finally {
      set({ productsLoading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ deleting: true });
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`, {
        timeout: REQUEST_TIMEOUT_MS,
      });
      set((state) => ({
        products: state.products.filter((product) => String(product.id) !== String(id)),
      }));
      toast.success("Product deleted successfully");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    } finally {
      set({ deleting: false });
    }
  },

  fetchProduct: async (id) => {
    set({
      productLoading: true,
      error: null,
      currentProduct: null,
      formData: { ...initialFormData },
    });
    try {
      const response = await axios.get(`${BASE_URL}/api/products/${id}`, {
        timeout: REQUEST_TIMEOUT_MS,
      });
      const product = response.data.data;
      if (!product || typeof product !== "object") {
        throw new Error("The server returned an invalid product.");
      }
      set({ currentProduct: product, formData: product });
      return true;
    } catch (error) {
      set({ error: getErrorMessage(error) });
      return false;
    } finally {
      set({ productLoading: false });
    }
  },

  updateProduct: async (id) => {
    set({ saving: true });
    try {
      const response = await axios.put(
        `${BASE_URL}/api/products/${id}`,
        get().formData,
        { timeout: REQUEST_TIMEOUT_MS },
      );
      const product = response.data.data;
      set((state) => ({
        currentProduct: product,
        formData: product,
        products: state.products.map((item) =>
          String(item.id) === String(id) ? product : item,
        ),
      }));
      toast.success("Product updated successfully");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    } finally {
      set({ saving: false });
    }
  },
}));
