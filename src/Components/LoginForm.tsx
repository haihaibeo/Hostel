import { Box, FormControl, FormLabel, Input, Button, Checkbox } from '@chakra-ui/react';
import React from 'react'
import { FaArrowRight } from 'react-icons/fa';
import { AuthContext } from '../Contexts/AuthContext';

type LoginFormProps = {
    initRef?: React.RefObject<HTMLInputElement>;
}

const LoginForm: React.FC<LoginFormProps> = ({ initRef }) => {
    const [loginForm, setLoginForm] = React.useState<LoginRequest>({
        email: "",
        password: "",
        remember: false
    });
    const authContext = React.useContext(AuthContext);

    const handleLogin = () => {
        authContext.loginAsync(loginForm);
    }

    return (
        <Box d="flex" flexDir="column">
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Enter your email" ref={initRef} variant="filled" size="lg"></Input>
            </FormControl>
            <FormControl my="2" isRequired>
                <FormLabel>Password</FormLabel>
                <Input placeholder="Enter your password" variant="filled" size="lg"></Input>
            </FormControl>
            <FormControl>
                <Checkbox size="lg">Remember me</Checkbox>
            </FormControl>
            <Button my="3" w="30%" rounded="full" type="submit" alignSelf="center" title="Login"
                isLoading={authContext.isLoading}
                onClick={handleLogin}>
                <FaArrowRight />
            </Button>
        </Box>
    );
}

export default LoginForm;