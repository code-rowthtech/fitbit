import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const container = document.getElementById("root");
let root = container._reactRoot;

if (!root) {
  root = ReactDOM.createRoot(container);
  container._reactRoot = root;
}

root.render(
  <Provider store={store}>
    <App />
    <ToastContainer />
  </Provider>
);
