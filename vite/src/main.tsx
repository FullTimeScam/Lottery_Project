import React from "react";
import ReactDOM from "react-dom/client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import App from "./App";

const theme = extendTheme({
  fonts: {
    body: "VT323, sans-serif",
    heading: "VT323, sans-serif",
  },
  colors: {
    win95: {
      gray: "#C3C3C3",
      lightGray: "#DFDFDF",
      darkGray: "#7A7A7A",
      black: "#000000",
      blue: "#000080",
      white: "#FFFFFF",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
