import { useToast } from '@chakra-ui/toast';
import React from 'react';

type LoginResponse = {
    userId: string;
    name: string;
    email: string;
    token: string;
}

type AuthContextStates = {
    loginAsync: (request: LoginRequest) => Promise<void>;
    logoutAsync: () => Promise<void>;
    registerAsync?: () => Promise<void>;
    user?: LoginResponse;
    isLoading: boolean;
}

export const AuthContext = React.createContext<AuthContextStates>({} as AuthContextStates);

const loginAsync = async (request: LoginRequest) => {
    const dumb: LoginResponse = {
        email: "mock@mail.com",
        name: "Mock Name",
        token: "long long long token",
        userId: "123412324"
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    localStorage.setItem("user", JSON.stringify(dumb));
    return dumb;
    // request.email = request.email.trim();
    // if (request.remember === undefined) request.remember = false;

    // const response = await fetch("/api/user/authenticate", {
    //     body: JSON.stringify({
    //         "email": request.email,
    //         "password": request.password,
    //         "remember": request.remember
    //     }),
    //     method: "POST",
    // })
    // const data: LoginResponse = await response.json();
    // return data;
}

export const AuthProvider: React.FC = ({ children }) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [user, setUser] = React.useState<LoginResponse | undefined>(undefined);
    const toast = useToast();

    React.useEffect(() => {
        const foundUser = localStorage.getItem("user");
        if (foundUser) {
            setUser(JSON.parse(foundUser) as LoginResponse);
        }
    }, [])

    const login = async ({ email, password, remember }: LoginRequest) => {
        setIsLoading(true);
        const data = await loginAsync({ email, password, remember });
        setUser(data);
        setIsLoading(false);
        toast({
            title: "Logged in successfully!",
            isClosable: true,
            duration: 3000,
            status: "success"
        })
    }

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

    return (
        <AuthContext.Provider value={{ loginAsync: login, logoutAsync: logoutAsync, isLoading: isLoading, user: user }}>
            {children}
        </AuthContext.Provider>
    )
}