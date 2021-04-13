import { useToast } from '@chakra-ui/toast';
import axios, { AxiosResponse } from 'axios';
import React from 'react';
import { useMutation } from 'react-query';
import { API_URL, authenticate } from '../API';


type AuthContextStates = {
    loginAsync: (request: LoginRequest) => any
    logoutAsync: () => Promise<void>;
    registerAsync?: () => Promise<void>;
    user?: UserResponse;
    isLoading: boolean;
}

export const AuthContext = React.createContext<AuthContextStates>({} as AuthContextStates);

export const AuthProvider: React.FC = ({ children }) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [user, setUser] = React.useState<UserResponse | undefined>(undefined);
    const toast = useToast();

    const mutateLogin = useMutation<AxiosResponse<UserResponse>, any, LoginRequest>(authenticate, {
        onSuccess: (res) => {
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
            toast({ description: "Logged in successfully", status: "success", duration: 3000 });
        },
        onError: (res) => { toast({ description: res.data.message, status: "error", duration: 3000 }) },
        onSettled: () => setIsLoading(false)
    })

    React.useEffect(() => {
        const foundUser = localStorage.getItem("user");
        if (foundUser) {
            setUser(JSON.parse(foundUser) as UserResponse);
        }
    }, [])

    const logoutAsync = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser(undefined);
        localStorage.removeItem("user");
        toast({
            title: "Logged out successfully!",
            isClosable: true,
            duration: 3000,
            status: "success"
        })
        await new Promise(resolve => setTimeout(resolve, 500));
        // window.location.reload();
    }

    const loginAsync = async (request: LoginRequest) => {
        console.log(request);
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
        // const dumb: UserResponse = {
        //     email: "mock@mail.com",
        //     name: "Mock Name",
        //     token: "long long long token",
        //     userId: "123412324"
        // }
        // localStorage.setItem("user", JSON.stringify(dumb));
        // setIsLoading(false);
        // return dumb;

        // const response = axios.post(API_URL + "/api/user/authenticate", {
        //     "email": request.email,
        //     "password": request.password
        // })
    }

    return (
        <AuthContext.Provider value={{ loginAsync: loginAsync, logoutAsync: logoutAsync, isLoading: isLoading, user: user }}>
            {mutateLogin.isError && console.log(mutateLogin.error)}
            {children}
        </AuthContext.Provider>
    )
}