import App from "@/App.jsx";
import ReactDOM from "react-dom/client";

import store from "@app/store.js";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { theme } from "@app/theme.js";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

import "@styles/index.css";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Theme>
          <ThemeProvider theme={theme}>
            <StyledEngineProvider injectFirst>
              <CssBaseline />
              <App />
            </StyledEngineProvider>
          </ThemeProvider>
        </Theme>
      </QueryClientProvider>
    </BrowserRouter>
  </Provider>
);
