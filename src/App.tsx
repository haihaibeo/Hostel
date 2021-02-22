import * as React from "react"
import {
  ChakraProvider,
  Box,
  extendTheme,
} from "@chakra-ui/react"
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import HomePage from "./Pages/HomePage";
import SingleRoom from "./Pages/SingleRoom";
import ErrorPage from "./Pages/ErrorPage";
import RoomsPage from "./Pages/RoomsPage";
import "./App.css";
import { mode } from "@chakra-ui/theme-tools";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "./Components/NavComponents/Footer";
// theme.components.Button.baseStyle.borderRadius = "0";

const myTheme = extendTheme({
  components: {
    Button: {
      defaultProps: {
      }
    },
  }
})


export const App = () => (
  <Router basename="/">
    <ChakraProvider theme={myTheme}>

      <Box d="flex" flexDir="column" minH="100vh">
        <Box flex="1">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/room/:slug" component={SingleRoom} />
            <Route exact path="/rooms/:slug" component={RoomsPage} />
            <Route exact path="/rooms/" component={RoomsPage} />
            <Route component={ErrorPage} />
          </Switch>
        </Box>
        <Box flexShrink={0}>
          <Footer />
        </Box>
      </Box>

    </ChakraProvider>
  </Router>
)
