import { Box, FormControl, FormLabel, Input, Button, Checkbox, FormErrorMessage } from '@chakra-ui/react';
import React from 'react'
import { FaArrowRight } from 'react-icons/fa';
import { useHistory } from 'react-router';
import { AuthContext } from '../Contexts/AuthContext';

type LoginFormProps = {
    initRef?: React.RefObject<HTMLInputElement>;
    fromUrl?: string;
}

function validateEmail(email: string | undefined) {
    if (!email) return false;
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


const LoginForm: React.FC<LoginFormProps> = ({ initRef, fromUrl }) => {
    const history = useHistory();

    const [loginForm, setLoginForm] = React.useState<LoginRequest>({
        remember: false
    });

    const [emailError, setEmailError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);

    const validateForm = (email: string | undefined, password: string | undefined) => {
        if (validateEmail(email)) {
            setEmailError(false);
        } else setEmailError(true);
        if (password === "") {
            setPasswordError(true)
        } else setPasswordError(false);
    }

    React.useEffect(() => {
        validateForm(loginForm.email, loginForm.password);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loginForm.email, loginForm.password])

    const authContext = React.useContext(AuthContext);

    const handleLogin = () => {
        authContext.loginAsync(loginForm);
        if (fromUrl) history.replace(fromUrl);
    }

    return (
        <FormControl isRequired isDisabled={authContext.isLoading} isInvalid={emailError || passwordError} d="flex" flexDir="column">
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input placeholder="Enter your email" id="email" isInvalid={emailError} ref={initRef} variant="filled" size="lg" type="email"
                value={loginForm.email} isRequired
                onChange={(e) => setLoginForm(s => ({
                    ...s,
                    email: e.target.value.trim()
                }))}></Input>
            <FormErrorMessage>{"Email not correct"}</FormErrorMessage>

            <FormLabel htmlFor="password" my="2">Password</FormLabel>
            <Input placeholder="Enter your password" id="password" isInvalid={passwordError} variant="filled" size="lg" type="password"
                value={loginForm.password} required={true} minLength={1} isRequired
                onChange={(e) => setLoginForm(s => ({
                    ...s,
                    password: e.target.value
                }))}></Input>

            <Checkbox size="lg" checked={loginForm.remember} mt="2"
                onChange={(e) => setLoginForm(s => ({ ...s, remember: e.target.checked }))}>
                Remember me
            </Checkbox>

            <Button my="3" w="30%" rounded="full" type="submit" alignSelf="center" title="Login"
                isLoading={authContext.isLoading}
                isDisabled={emailError || passwordError}
                onClick={handleLogin}>
                <FaArrowRight />
            </Button>
        </FormControl>
    );
}

export default LoginForm;