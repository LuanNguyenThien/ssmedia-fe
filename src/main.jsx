import App from "@root/App";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "animate.css";
import { Provider } from "react-redux";
import { store } from "@redux/store";
import { AppWrapper } from "@pages/admin/components/common/PageMeta.tsx";
import { ThemeProvider } from "@pages/admin/context/ThemeContext.tsx";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    
  // </React.StrictMode>
  <Provider store={store}>
    <ThemeProvider>
      <AppWrapper>
        {/* <ChakraProvider> */}
        <App />
        {/* </ChakraProvider> */}
      </AppWrapper>
    </ThemeProvider>
  </Provider>
);
