import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAccessToken, clearAccessToken } from '../lib/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,

      login: (user, token) => {
        setAccessToken(token);
        set({
          user,
          isAuthenticated: true,
          isAdmin: user.role === 'admin',
        });
      },

      logout: () => {
        clearAccessToken();
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      updateUser: (userData) => {
        set({
          user: { ...get().user, ...userData },
        });
      },

      setToken: (token) => {
        setAccessToken(token);
      },
    }),
    {
      name: 'prestige-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.isAuthenticated) {
          // Token will be refreshed on first API call if needed
        }
      },
    }
  )
);

export default useAuthStore;
