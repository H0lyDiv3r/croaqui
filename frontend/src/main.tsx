import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App";
import { Provider } from "./components/ui/provider";
import { ToastProvider } from "./components/providers";
import "@fontsource/rubik";

const container = document.getElementById("root");

const root = createRoot(container!);

root.render(
  <Provider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </Provider>,
);
