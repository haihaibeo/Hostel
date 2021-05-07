import { Box, FormControl, FormLabel, Input, Button, Checkbox, FormErrorMessage, chakra, useDisclosure, Collapse } from '@chakra-ui/react';
import React from 'react'
import { FaArrowRight } from 'react-icons/fa';
import { useHistory } from 'react-router';
import { AuthContext } from '../Contexts/AuthContext';

type LoginFormProps = {
    initRef?: React.RefObject<HTMLInputElement>;
    fromUrl?: string;
    isRegistering: boolean;
}

type FormState = {
    email?: string;
    password?: string;
    confirmedPassword?: string;
    remember: boolean;
    isRegistering: boolean;
}

function validateEmail(email: string | undefined) {
    if (!email) return false;
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


const LoginForm: React.FC<LoginFormProps> = ({ initRef, fromUrl, isRegistering }) => {
    const history = useHistory();

    const [loginForm, setLoginForm] = React.useState<FormState>({
        remember: false,
        isRegistering: isRegistering
    });

    const [emailError, setEmailError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);

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

    React.useEffect(() => {
        if (loginForm.isRegistering && loginForm.confirmedPassword === loginForm.password) {
            console.log(loginForm.password);
            console.log(loginForm.confirmedPassword);

            setConfirmPasswordError(false);
            console.log(confirmPasswordError);
        } else setConfirmPasswordError(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loginForm.confirmedPassword, loginForm.isRegistering, loginForm.password])

    const authContext = React.useContext(AuthContext);

    const handleLogin = () => {
        authContext.loginAsync(loginForm);
        if (fromUrl) history.replace(fromUrl);
    }

    const handleRegister = () => {
        authContext.registerAsync({ email: loginForm.email, password: loginForm.password, confirmPassword: loginForm.confirmedPassword });
        if (fromUrl) history.replace(fromUrl);
    }

    const toggleMode = () => {
        setLoginForm((s) => ({
            ...s,
            isRegistering: !s.isRegistering
        }))
    }

    return (
        <chakra.form d="flex" flexDir="column">
            <FormControl isInvalid={emailError}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input placeholder="Enter your email" id="email" isInvalid={emailError} ref={initRef} variant="filled" size="lg" type="email"
                    value={loginForm.email} isRequired
                    onChange={(e) => setLoginForm(s => ({
                        ...s,
                        email: e.target.value.trim()
                    }))}></Input>
                <FormErrorMessage>{"Email not correct"}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={passwordError}>
                <FormLabel htmlFor="password" my="2">Password</FormLabel>
                <Input placeholder="Enter your password" id="password" isInvalid={passwordError} variant="filled" size="lg" type="password"
                    value={loginForm.password} minLength={1} isRequired
                    onChange={(e) => setLoginForm(s => ({
                        ...s,
                        password: e.target.value
                    }))}></Input>
            </FormControl>

            <Collapse in={loginForm.isRegistering}>
                <FormControl isInvalid={confirmPasswordError}>
                    <FormLabel htmlFor="confirm-password" my="2">Confirm Password</FormLabel>
                    <Input placeholder="Confirm your password" id="confirm-password" isInvalid={confirmPasswordError} variant="filled" size="lg" type="password"
                        value={loginForm.confirmedPassword} minLength={1} isRequired
                        onChange={(e) => setLoginForm(s => ({
                            ...s,
                            confirmedPassword: e.target.value
                        }))}></Input>
                </FormControl>
                <FormErrorMessage>{"Password does not match"}</FormErrorMessage>
            </Collapse>

            <Checkbox size="lg" checked={loginForm.remember} mt="2"
                onChange={(e) => setLoginForm(s => ({ ...s, remember: e.target.checked }))}>
                Remember me
                </Checkbox>

            <Button my="3" w="30%" rounded="full" type="submit" alignSelf="center" title="Login"
                isLoading={authContext.isLoading}
                isDisabled={loginForm.isRegistering ? emailError || passwordError || confirmPasswordError : emailError || passwordError}
                onClick={!loginForm.isRegistering ? handleLogin : handleRegister}>
                <FaArrowRight />
            </Button>

            <Button variant="link" alignSelf="center" textStyle="" onClick={() => toggleMode()}>{!loginForm.isRegistering ? "Register your account!" : "Or login instead!"}</Button >
        </chakra.form>
    );
}

export default LoginForm;