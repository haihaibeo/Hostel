import { useToast } from '@chakra-ui/toast';
import { AxiosResponse } from 'axios';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { authenticate, register, validateToken } from '../API';

interface UserTokenPayload extends JwtPayload {
    roles: string[] | string;
    email: string;
    name: string;
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

export const AuthProvider: React.FC = ({ children }) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [user, setUser] = React.useState<UserResponse | undefined>(undefined);
    const [token, setToken] = React.useState(localStorage.getItem("token"));

    const queryClient = useQueryClient();

    const toast = useToast();

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
    }, [])

    /**
     * If token changes, update user and axios.interceptor
     */
    React.useEffect(() => {
        if (token) {
            const decodedUser = jwtDecode<UserTokenPayload>(token);
            setUser({
                email: decodedUser.email,
                name: decodedUser.name,
                roles: decodedUser.roles,
                token: token
            })
        }
    }, [token]);

    const updateToken = (token: string) => {
        setToken(token);
    }


    // TODO: fix token validation
    // const validation = useQuery(["validateToken", user?.token], () => {
    //     if (user?.token) return validateToken(user?.token)
    // }, {
    //     refetchInterval: 1000 * 60,
    //     staleTime: 1000 * 60 * 60 * 24,
    //     onSuccess: () => {
    //         axios.interceptors.request.use((config) => {
    //             if (user?.token) {
    //                 config.headers.Authorization = `Bearer ${user.token}`;
    //             }
    //             return config;
    //         }, (e) => {
    //             return Promise.reject(e);
    //         })
    //     }
    // })

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