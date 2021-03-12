import * as React from "react"
import {
  ChakraProvider,
  Box,
  extendTheme,
} from "@chakra-ui/react"
import { HashRouter, Route, Switch, BrowserRouter } from 'react-router-dom'
import HomePage from "./Pages/HomePage";
import SingleRoom from "./Pages/SingleRoom";
import ErrorPage from "./Pages/ErrorPage";
import RoomsPage from "./Pages/RoomsPage";
import "./App.css";
import { mode } from "@chakra-ui/theme-tools";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "./Components/NavComponents/Footer";
import { QueryClient, QueryClientProvider } from "react-query";
// theme.components.Button.baseStyle.borderRadius = "0";

const myTheme = extendTheme({
  components: {
    Button: {
      defaultProps: {
      }
    },
  }
})

const queryClient = new QueryClient();

export const App = () => (
  <HashRouter basename="/">
    <ChakraProvider theme={myTheme}>
      <QueryClientProvider client={queryClient}>
        <Box d="flex" flexDir="column" minH="100vh">
          <Box flex="1" >
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/rooms/:slug" component={SingleRoom} />
              <Route exact path="/rooms/" component={RoomsPage} />
              <Route component={ErrorPage} />
            </Switch>
          </Box>
          <Box flexShrink={0}>
            <Footer />
          </Box>
        </Box>

      </QueryClientProvider>
    </ChakraProvider>
  </HashRouter>
)
