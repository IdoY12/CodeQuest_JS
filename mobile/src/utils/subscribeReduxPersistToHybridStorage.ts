import AsyncStorage from "@react-native-async-storage/async-storage";
import type store from "@/redux/store";
import { REDUX_PERSIST_KEY } from "@/utils/hydrateStore";
import { writeSecureSessionTokens } from "@/utils/secureSessionTokens";

export function subscribeStoreToHybridStorage(appStore: typeof store): () => void {
  let previousSerialized = "";
  return appStore.subscribe(() => {
    const state = appStore.getState();
    const sessionForDisk = {
      ...state.session,
      accessToken: null as string | null,
      refreshToken: null as string | null,
    };
    const serialized = JSON.stringify({
      session: sessionForDisk,
      profile: state.profile,
      xp: state.xp,
      streak: state.streak,
      lesson: state.lesson,
      duel: state.duel,
      puzzle: state.puzzle,
    });
    if (serialized === previousSerialized) return;
    previousSerialized = serialized;
    void AsyncStorage.setItem(REDUX_PERSIST_KEY, serialized);
    void writeSecureSessionTokens(state.session.accessToken, state.session.refreshToken);
  });
}
