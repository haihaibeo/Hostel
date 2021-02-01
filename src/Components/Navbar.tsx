import React from 'react';
import { Box, Button, Flex, Heading, HStack, Spacer } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { Logo } from "../Logo";


const Navbar = () => {
    return (
        <Box marginBottom={["5%"]}>
            <Flex justifyContent="center" alignItems="center" flexWrap="wrap">
                <HStack spacing={4}>
                    <Logo />
                    <Heading size="md">NiceHostels.com</Heading>
                </HStack>
                <Spacer />
                <HStack spacing={4}>
                    <ColorModeSwitcher />
                    <Button variant="outline">Login</Button>
                    <Button variant="outline">Register</Button>
                </HStack>
            </Flex>
        </Box>
    )
}

export default Navbar;