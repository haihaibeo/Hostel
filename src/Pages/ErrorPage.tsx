import { Box } from '@chakra-ui/react'
import React from 'react'

type ErrorPageProps = {
    message?: string
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message }) => {
    if (message) return (
        <Box>{message}</Box>
    )
    return (
        <div>
            Something's wrong
        </div>
    )
}

export default ErrorPage;