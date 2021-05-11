import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Collapse, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { registerHost } from '../API'
import { AuthContext } from '../Contexts/AuthContext'

const RegisterHostPage = () => {
    const auth = useContext(AuthContext);
    const toast = useToast();
    const alert = useDisclosure();

    const handleRegisterClick = () => {
        alert.onOpen();
        registerHost().then(res => {
            console.log(res);
            if (res.status === 200) {
                localStorage.setItem("token", res.data.token);
                auth.updateToken(res.data.token);
                toast({
                    description: "Congrat! You are eligible as a new host!",
                    status: "success"
                })
            }
        }).catch(err => {
            toast({
                description: err,
                status: "error"
            })
        })
    }

    return (
        <Box d="flex" flexDir="column" gridGap="2" justifyItems="center" justifyContent="center">
            <Button onClick={() => handleRegisterClick()}
                colorScheme="green" w="30ch"
                isDisabled={auth.user?.roles.includes("Owner")}
                alignSelf="center"
            >
                {auth.user?.roles.includes("Owner") ? "You are already a host!" : "Register to become a host!"}
            </Button>
            <Collapse in={alert.isOpen}>
                <SuccessAlert></SuccessAlert>
            </Collapse>
        </Box>
    )
}

const SuccessAlert = () => <Alert
    status="success"
    variant="subtle"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    textAlign="center"
    height="200px"
>
    <AlertIcon boxSize="40px" mr={0} />
    <AlertTitle mt={4} mb={1} fontSize="lg">
        Application submitted!
                </AlertTitle>
    <AlertDescription maxWidth="sm">
        Thanks for submitting your application. Our team will get back to you soon.
                </AlertDescription>
</Alert>

export default RegisterHostPage;