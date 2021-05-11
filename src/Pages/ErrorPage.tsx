import { Alert, AlertDescription, AlertIcon, AlertTitle, Box } from '@chakra-ui/react'
import React from 'react'
import { useLocation } from 'react-router'

type ErrorLocationState = {
    message: string;
}

const ErrorPage = () => {
    const location = useLocation<ErrorLocationState>();
    if (location.state) {
        const { message } = location.state;
        return <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
        >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
                {message}
            </AlertTitle>
            <AlertDescription maxWidth="md">
                Look like you have some problems! Contact us for more info!
                </AlertDescription>
        </Alert>
    }
    return (
        <Alert
            status="info"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
        >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
                Not Found!
            </AlertTitle>
            <AlertDescription maxWidth="md">
                The page you are looking does not exist or was deleted
                </AlertDescription>
        </Alert>
    )
}

export default ErrorPage;