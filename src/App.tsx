import * as React from "react"
import {
  ChakraProvider,
  Box,
  Grid,
  theme,
} from "@chakra-ui/react"
import Navbar from "./Components/Navbar"
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from "./Pages/Home";
import SingleRoom from "./Pages/SingleRoom";
import ErrorPage from "./Pages/ErrorPage";
import Rooms from "./Pages/Rooms";

export const App = () => (
  <Router>
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <Box marginX={["5%", "10%", "15%"]}>
            <Navbar></Navbar>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/rooms/:slug" component={SingleRoom} />
              <Route exact path="/rooms" component={Rooms} />
              <Route component={ErrorPage} />
            </Switch>
          </Box>
        </Grid>
      </Box>
    </ChakraProvider>
  </Router>
)
