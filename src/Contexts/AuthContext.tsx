import { useToast } from '@chakra-ui/toast';
import axios from 'axios';
import React from 'react';
import { API_URL } from '../App';

type UserResponse = {
    userId: string;
    name: string;
    email: string;
    token: string;
}

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
        const dumb: UserResponse = {
            email: "mock@mail.com",
            name: "Mock Name",
            token: "long long long token",
            userId: "123412324"
        }
        localStorage.setItem("user", JSON.stringify(dumb));
        setIsLoading(false);
        return dumb;
        // const response = axios.post(API_URL + "/api/user/authenticate", {
        //     "email": request.email,
        //     "password": request.password
        // })

        // response.then(d => {
        //     if (d.status === 400) {
        //         console.log("400")
        //         return d;
        //     }
        //     setUser(d.data);
        //     localStorage.setItem("user", JSON.stringify(d.data));
        //     return response;
        // })
        //     .then(m => console.log(m))
        //     .catch(error => console.log(error))
        //     .finally(() => { setIsLoading(false) });
    }

    return (
        <AuthContext.Provider value={{ loginAsync: loginAsync, logoutAsync: logoutAsync, isLoading: isLoading, user: user }}>
            {children}
        </AuthContext.Provider>
    )
}