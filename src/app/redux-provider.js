"use client"; // ✅ This should be a Client Component

import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReduxProvider({ children }) {
    return (
        <Provider store={store}>
            {children}

        </Provider>
    );
}
