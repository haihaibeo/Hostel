import React from 'react';
import { Box, Button, Center, Flex, Heading, HStack, Spacer } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../../ColorModeSwitcher';
import { Logo } from "../../Logo";
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <Box marginBottom={["5%"]}>
            <Flex justifyContent="center" alignItems="center">
                <Link to="/">
                    <HStack spacing={4}>
                        <Center>
                            <Logo />
                        </Center>
                        <Heading size="md">NiceHostels.com</Heading>
                    </HStack>
                </Link>
                <Spacer />
                <HStack spacing={4}>
                    <ColorModeSwitcher />
                    <Button variant="ghost">Login</Button>
                    <Button variant="solid">Register</Button>
                </HStack>
            </Flex>
        </Box>
    )
}

export default Navbar;