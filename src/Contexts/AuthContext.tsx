import { useToast } from '@chakra-ui/toast';
import { AxiosResponse } from 'axios';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import { authenticate, axAuth, register, validateToken } from '../API';

interface UserTokenPayload extends JwtPayload {
    roles: string[] | string;
    email: string;
    name: string;
    userId: string;
}

type AuthContextStates = {
    loginAsync: (request: LoginRequest) => any
    registerAsync: (request: RegisterRequest) => any
    logoutAsync: () => Promise<void>;
    updateToken: (token: string) => void;
    user?: UserResponse;
    isLoading: boolean;
}

export const AuthContext = React.createContext<AuthContextStates>({} as AuthContextStates);

// TODO: Refactoring: Get user from localStorage
export const AuthProvider: React.FC = ({ children }) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [user, setUser] = React.useState<UserResponse>();
    const [token, setToken] = React.useState(localStorage.getItem("token"));

    const history = useHistory();

    const toast = useToast();

    React.useEffect(() => {
        axAuth.interceptors.response.use(config => config, (error) => {
            console.log(error);
            if (error.status === 404) {
                // history.push("/notfound");
            }
            return Promise.reject(error);
        });
    }, [])

    /**
     * Check for token in localStorage
     */
    React.useEffect(() => {
        const tokenStorage = localStorage.getItem("token");
        if (tokenStorage) {
            validateToken(tokenStorage).then(res => {
                console.log("validating...")
                if (res.status !== 200) return logoutAsync("Token expired");
            })
            setToken(tokenStorage);
        }
        else {
            loginAsync({ email: "test@mail.com", password: "password" });
        }
    }, [])

    React.useEffect(() => {
        if (token) {
            const decodedUser = jwtDecode<UserTokenPayload>(token);
            setUser({
                email: decodedUser.email,
                name: decodedUser.name,
                roles: decodedUser.roles,
                token: token,
                userId: decodedUser.userId,
            })
        }
    }, [token]);

    const updateToken = (token: string) => {
        setToken(token);
    }

    const mutateLogin = useMutation<AxiosResponse<UserResponse>, any, LoginRequest>(authenticate, {
        onSuccess: (res) => {
            setToken(res.data.token);
            localStorage.setItem("token", res.data.token);
            toast({ description: "Logged in successfully", status: "success", duration: 3000 });
        },
        onError: (res) => { toast({ description: res.data.message, status: "error", duration: 3000 }) },
        onSettled: () => setIsLoading(false)
    })

    const mutateRegister = useMutation<AxiosResponse<UserResponse>, any, RegisterRequest>(register, {
        onSuccess: (res) => {
            // setUser(res.data);
            setToken(res.data.token);
            localStorage.setItem("token", res.data.token);
            toast({ description: "Logged in successfully", status: "success", duration: 3000 });
        },
        onError: (res) => {
            console.log(res.data);
            for (let i = 0; i < res.data.messages.length; i++) {
                toast({ description: res.data.messages[i], status: "error", duration: 3000 })
            }
        },
        onSettled: () => setIsLoading(false)
    })

    const logoutAsync = async (msg?: string) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser(undefined);
        setToken(null);
        localStorage.removeItem("token");
        toast({
            title: msg ? msg : "Logged out successfully!",
            isClosable: true,
            duration: 3000,
            status: "success"
        })
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    const loginAsync = async (request: LoginRequest) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
            mutateLogin.mutate(request);
        }
        catch (e) {
            console.log(e);
        }
        finally {
            setIsLoading(false);
        }
    }

    const registerAsync = async (request: RegisterRequest) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
            mutateRegister.mutate(request);
        } catch (error) {
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{
            loginAsync: loginAsync,
            logoutAsync: logoutAsync,
            updateToken: updateToken,
            isLoading: isLoading,
            user: user,
            registerAsync: registerAsync
        }}>
            {children}
        </AuthContext.Provider>
    )
}