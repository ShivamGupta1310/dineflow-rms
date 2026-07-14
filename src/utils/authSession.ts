import { persistor, store } from "@store";
import {
  clearCaptainSession,
  clearOwnerSession,
  logout,
  logoutSession,
} from "@store/slices/authSlice";
import { StorageKeys } from "@utils/constants";
import { showToast } from "@utils/toastHelper";
import { removeItem } from "@utils/storage";

let clearSessionPromise: Promise<void> | null = null;
export const OWNER_ROLE = "owner";
export const CAPTAIN_ROLE = "captain";

const flushPersistedState = async () => {
  try {
    await persistor.flush();
  } catch (error) {
    console.error("Failed to flush persisted auth state:", error);
  }
};

export const clearAppSession = async () => {
  if (clearSessionPromise) {
    return clearSessionPromise;
  }

  clearSessionPromise = (async () => {
    const { role, sessionId } = store.getState().auth;

    if (sessionId) {
      const result = await store.dispatch(
        logoutSession({ session_id: sessionId }),
      );

      if (logoutSession.rejected.match(result)) {
        throw new Error(
          typeof result.payload === "string"
            ? result.payload
            : "Logout failed",
        );
      }

      showToast("success", "Logout Successfully");
    }

    if (role === OWNER_ROLE) {
      store.dispatch(clearOwnerSession());
      removeItem(StorageKeys.OWNER_ACCESS_CODE);
      removeItem(StorageKeys.RESTAURANT_ACCESS_CODE);
      await flushPersistedState();
      return;
    }

    if (role === CAPTAIN_ROLE) {
      store.dispatch(clearCaptainSession());
      removeItem(StorageKeys.OWNER_ACCESS_CODE);
      await flushPersistedState();
      return;
    }

    store.dispatch(logout());
    await flushPersistedState();
  })().finally(() => {
    clearSessionPromise = null;
  });

  return clearSessionPromise;
};
