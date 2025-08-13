import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        console.log("Checking auth...");
        try {
            const res = await axiosInstance.get("/v1/auth/check");
            console.log("Auth check successful:", res.data);
            set({ authUser: res.data });
        } catch (err) {
            console.log("Error in checkAuth", err.response?.status, err.response?.data);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (formData) => {
        console.log("Signing up with:", formData);
        set({ isSigningUp: true });
        try {
            console.log("Making request to:", axiosInstance.defaults.baseURL + "/v1/auth/signup");
            const res = await axiosInstance.post("/v1/auth/signup", formData);
            console.log("Signup successful:", res.data);
            set({ authUser: res.data });
            toast.success("Account created successfully!");
            return res.data;
        } catch (err) {
            console.log("Error in signup:", {
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: err.response?.data,
                message: err.message,
                code: err.code
            });
            const errorMessage = err.response?.data?.message || err.message || "Signup failed";
            toast.error(errorMessage);
            throw err;
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (formData) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/v1/auth/login", formData);
            set({ authUser: res.data });
            toast.success("Login successful!");
            return res.data;
        } catch (err) {
            console.log("Error in login", err);
            const errorMessage = err.response?.data?.message || "Login failed";
            toast.error(errorMessage);
            throw err;
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/v1/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully!");
        } catch (err) {
            console.log("Error in logout", err);
            toast.error("Logout failed");
        }
    },

    updateProfile: async (profilePic) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/v1/auth/update-profile", { profilePic });
            set({ authUser: res.data });
            toast.success("Profile updated successfully!");
            return res.data;
        } catch (err) {
            console.log("Error in updateProfile", err);
            const errorMessage = err.response?.data?.message || "Profile update failed";
            toast.error(errorMessage);
            throw err;
        } finally {
            set({ isUpdatingProfile: false });
        }
    }
}));
