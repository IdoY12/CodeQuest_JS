import { View } from "react-native";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { AppShell } from "@/components/layout/AppShell/AppShell";
import { styles } from "./App.styles";

export function App() {
  return (
    <View style={styles.root}>
      <Provider store={store}>
        <AppShell />
      </Provider>
    </View>
  );
}
