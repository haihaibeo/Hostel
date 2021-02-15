import * as React from "react"
import {
  ChakraProvider,
  Box,
  extendTheme,
} from "@chakra-ui/react"
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import HomePage from "./Pages/HomePage";
import SingleRoom from "./Pages/SingleRoom";
import ErrorPage from "./Pages/ErrorPage";
import RoomsPage from "./Pages/RoomsPage";
import "./App.css";
import { mode } from "@chakra-ui/theme-tools";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
  <Router>
    <ChakraProvider theme={myTheme}>
      <Box>
        {/* <Box textAlign="center" fontSize="xl" pt="4" marginX={["5%", "10%", "15%"]}> */}
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/room/:slug" component={SingleRoom} />
          <Route exact path="/rooms/:slug" component={RoomsPage} />
          <Route exact path="/rooms/" component={RoomsPage} />
          <Route component={ErrorPage} />
        </Switch>
      </Box>
    </ChakraProvider>
  </Router>
)
