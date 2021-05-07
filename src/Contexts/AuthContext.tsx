import { useToast } from '@chakra-ui/toast';
import axios, { AxiosResponse } from 'axios';
import React from 'react';
import { useMutation, useQuery } from 'react-query';
import { API_URL, authenticate, register, validateToken } from '../API';


type AuthContextStates = {
    loginAsync: (request: LoginRequest) => any
    registerAsync: (request: RegisterRequest) => any
    logoutAsync: () => Promise<void>;
    user?: UserResponse;
    isLoading: boolean;
}

export const AuthContext = React.createContext<AuthContextStates>({} as AuthContextStates);

export const AuthProvider: React.FC = ({ children }) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [user, setUser] = React.useState<UserResponse | undefined>(undefined);
    const toast = useToast();

    // TODO: fix token validation
    const validation = useQuery(["validateToken", user?.token], () => { if (user?.token) return validateToken(user?.token) }, {
        refetchInterval: 1000 * 60,
        staleTime: 1000 * 60 * 60 * 24,
        onSuccess: () => {
            axios.interceptors.request.use((config) => {
                if (user?.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
                return config;
            }, (e) => {
                return Promise.reject(e);
            })
        }
    })

    const mutateLogin = useMutation<AxiosResponse<UserResponse>, any, LoginRequest>(authenticate, {
        onSuccess: (res) => {
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
            toast({ description: "Logged in successfully", status: "success", duration: 3000 });
        },
        onError: (res) => { toast({ description: res.data.message, status: "error", duration: 3000 }) },
        onSettled: () => setIsLoading(false)
    })

    const mutateRegister = useMutation<AxiosResponse<UserResponse>, any, RegisterRequest>(register, {
        onSuccess: (res) => {
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
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



    /**
     * Check for user in localStorage
     */
    React.useEffect(() => {
        const foundUser = localStorage.getItem("user");
        if (foundUser) {
            const user = JSON.parse(foundUser) as UserResponse;

            validateToken(user.token).then(res => {
                console.log("validating...")
                console.log(res);
                if (res.status !== 200) return logoutAsync("Token expired");
            })

            setUser(user);
            axios.interceptors.request.use((config) => {
                if (user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
                return config;
            }, (e) => {
                return Promise.reject(e);
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /**
     * When user is initialized, attach token to every request
     */
    React.useEffect(() => {
        axios.interceptors.request.use((config) => {
            if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
            return config;
        }, (e) => {
            return Promise.reject(e);
        })
    }, [user])

    const logoutAsync = async (msg?: string) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser(undefined);
        localStorage.removeItem("user");
        toast({
            title: msg ? msg : "Logged out successfully!",
            isClosable: true,
            duration: 3000,
            status: "success"
        })
        await new Promise(resolve => setTimeout(resolve, 500));
        // window.location.reload();
    }

    const loginAsync = async (request: LoginRequest) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
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
            isLoading: isLoading,
            user: user,
            registerAsync: registerAsync
        }}>
            {children}
        </AuthContext.Provider>
    )
}