import { Box, FormControl, FormLabel, Input, Button, Checkbox, FormErrorMessage } from '@chakra-ui/react';
import React from 'react'
import { FaArrowRight } from 'react-icons/fa';
import { AuthContext } from '../Contexts/AuthContext';

type LoginFormProps = {
    initRef?: React.RefObject<HTMLInputElement>;
}

const LoginForm: React.FC<LoginFormProps> = ({ initRef }) => {
    const submitRef = React.useRef<any>();

    const [loginForm, setLoginForm] = React.useState<LoginRequest>({
        remember: false
    });
    const authContext = React.useContext(AuthContext);

    const handleLogin = () => {
        submitRef.current.click();
        authContext.loginAsync(loginForm);
    }

    return (
        <Box d="flex" flexDir="column">
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Enter your email" ref={initRef} variant="filled" size="lg" type="email"
                    value={loginForm.email} required
                    onChange={(e) => setLoginForm(s => ({
                        ...s,
                        email: e.target.value
                    }))}></Input>
            </FormControl>
            <FormControl my="2" isRequired>
                <FormLabel>Password</FormLabel>
                <Input placeholder="Enter your password" variant="filled" size="lg" type="password"
                    value={loginForm.password} required minLength={1} isRequired
                    onChange={(e) => setLoginForm(s => ({
                        ...s,
                        password: e.target.value
                    }))}></Input>
                <FormErrorMessage>Wong</FormErrorMessage>
            </FormControl>
            <FormControl>
                <Checkbox size="lg" checked={loginForm.remember}
                    onChange={(e) => setLoginForm(s => ({ ...s, remember: e.target.checked }))}>
                    Remember me
                    </Checkbox>
            </FormControl>

            <Input d="none" type="submit" ref={submitRef}></Input>

            <Button my="3" w="30%" rounded="full" type="button" alignSelf="center" title="Login"
                isLoading={authContext.isLoading}
                onClick={handleLogin}>
                <FaArrowRight />
            </Button>
        </Box>
    );
}

export default LoginForm;