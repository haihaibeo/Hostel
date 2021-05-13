import * as React from "react"
import {
  ChakraProvider,
  Box,
  extendTheme,
} from "@chakra-ui/react"
import { HashRouter, Route, Switch, BrowserRouter, Redirect, RouteProps, useLocation, useHistory } from 'react-router-dom'
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
import { AuthContext, AuthProvider } from "./Contexts/AuthContext";
import ProfilePage from "./Pages/ProfilePage";
import Navbar from "./Components/NavComponents/Navbar";
import PublishRoomPage from "./Pages/PublishRoomPage";
import LoginForm from "./Components/LoginForm";
import LoadingBar from "react-top-loading-bar";
import PreviewRoomPage from "./Pages/PreviewRoomPage";
import RegisterHostPage from "./Pages/RegisterHostPage";
import { axAuth } from "./API";
// theme.components.Button.baseStyle.borderRadius = "0";

const myTheme = extendTheme({
  components: {
    Button: {
      defaultProps: {
      }
    },
  }
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {

    }
  }
});


export const App = () => {
  const loadingRef = React.useRef<any>(null);
  // loading bar will appear when a request is sended
  // and disappear when get a response
  // REMINDER: this is a fastest way to indicate top loading bar,
  // but not in a very elegant way, should put it in a context and update manually in component
  React.useEffect(() => {
    loadingRef.current.complete();

    axAuth.interceptors.request.use((config) => {
      loadingRef.current.staticStart();
      return config;
    }, (e) => {
      loadingRef.current.complete();
      return Promise.reject(e);
    })

    axAuth.interceptors.response.use((config) => {
      loadingRef.current.complete();
      return config;
    }, (e) => {
      loadingRef.current.complete();
      return Promise.reject(e);
    })

  }, [])
  return (
    <HashRouter basename="/">
      <ChakraProvider theme={myTheme}>
        <QueryClientProvider client={queryClient}>
          <Box d="flex" flexDir="column" minH="100vh">
            <AuthProvider>
              <ScrollToTop />
              <Box flex="1">
                <LoadingBar color="#f11946" ref={loadingRef}></LoadingBar>
                <Switch>
                  <Route exact path="/" >
                    <HomePage />
                  </Route>

                  <Route component={LoginPage} exact path="/login"
                    render={({ location }) =>
                      <Redirect to={{ pathname: "/login", state: { from: location } }} />
                    }
                  />
                  <Box mx="10%" mt="5">
                    <Navbar></Navbar>
                    <Switch>
                      <Route exact path="/rooms/:slug" component={SingleRoom} />
                      <Route exact path="/rooms" component={RoomsPage} />
                      <Route exact path="/room/preview" component={PreviewRoomPage} />
                      <AuthRoute exact path="/profile" component={ProfilePage}></AuthRoute>
                      <RoleRoute roles={["Owner"]} exact path="/user/publish" component={PublishRoomPage}></RoleRoute>roles={["Owner"]}
                      <AuthRoute exact path="/user/register-host" component={RegisterHostPage}></AuthRoute>
                      <RoleRoute roles={["Admin"]} exact path="/admin"></RoleRoute>
                      <Route component={ErrorPage} />
                    </Switch>
                  </Box>
                </Switch>
              </Box>
            </AuthProvider>
            <Box h="200px"></Box>
            {/* <Box position="relative" left={0} bottom={0}> */}
            <Footer as="footer" />
            {/* </Box> */}
          </Box>

        </QueryClientProvider>
      </ChakraProvider>
    </HashRouter>
  )
};

interface LocationState {
  from: {
    pathname: string;
  };
}

const LoginPage = () => {
  const location = useLocation<LocationState>();
  const auth = React.useContext(AuthContext);

  let { from } = location.state || { from: { pathname: "/" } };
  if (auth.user) return <Redirect to={from}></Redirect>

  return (
    <Box mx="20%" mt="10" flex="0">
      <Navbar />
      <LoginForm isRegistering={false}></LoginForm>
    </Box>
  );
}

const AuthRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  let auth = React.useContext(AuthContext);
  if (auth.user) return (<Route {...rest}>{children}</Route>)

  else return (<Route {...rest}>
    <Redirect to={{
      pathname: "/login",
      state: {
        from: rest.path
      }
    }} />
  </Route>)
}

type RoleRouteProps = {
  roles: AppRole[];
}

const RoleRoute = (props: RoleRouteProps & RouteProps) => {
  const { roles, children, ...rest } = props;
  const auth = React.useContext(AuthContext);

  if (!auth.user) return (<Route {...rest}>
    <Redirect to={{
      pathname: "/login",
      state: {
        from: rest.path
      }
    }} />
  </Route>)

  const ifContainsAll = (haystack?: string[] | string, needles?: string[]) => {
    if (!haystack) return false;
    if (!needles) return true;

    for (const n of needles) {
      if (!haystack.includes(n)) return false;
    }
    return true;
  }

  if (ifContainsAll(auth.user?.roles, roles)) return (<Route {...rest}>{children}</Route>)
  else return (
    <Route {...rest}>
      <Redirect to={{
        pathname: "/error",
        state: {
          message: "You are not authorized"
        }
      }}></Redirect>
    </Route>
  )
}

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname])

  return null;
}
