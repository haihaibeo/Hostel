import React from 'react';

type LoginResponse = {
    userId: string;
    name: string;
    email: string;
    token: string;
}

type AuthContextStates = {
    loginAsync: (request: LoginRequest) => Promise<void>;
    registerAsync?: () => Promise<void>
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
    const [user, setUser] = React.useState<LoginResponse>();

    const login = async ({ email, password, remember }: LoginRequest) => {
        setIsLoading(true);
        const data = await loginAsync({ email, password, remember });
        setUser(data);
        setIsLoading(false);
    }

    return (
        <AuthContext.Provider value={{ loginAsync: login, isLoading: isLoading, user: user }}>
            {children}
        </AuthContext.Provider>
    )
}