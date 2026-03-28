import React from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { AppShell } from "./AppShell/AppShell";

export function App() {
  return (
    <Provider store={store}>
      <AppShell />
    </Provider>
  );
}
