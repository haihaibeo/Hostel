import React from 'react';
import { Box, Center, Flex, Heading, HStack, Spacer } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../../ColorModeSwitcher';
import { Logo } from "../../Logo";
import { Link } from 'react-router-dom';
import LoginButton from '../LoginButton';
import RegisterButton from '../RegisterButton';
import { AuthContext } from '../../Contexts/AuthContext';

const Navbar = () => {
    const auth = React.useContext(AuthContext);

    return (
        <Box marginBottom={["5%"]}>
            <Flex justifyContent="center" alignItems="center">
                <Link to="/">
                    <HStack spacing={4}>
                        <Center>
                            <Logo />
                        </Center>
                        <Heading size="md" display={{ base: "none", sm: "block" }}>NiceHostels.com</Heading>
                    </HStack>
                </Link>
                <Spacer />
                <HStack spacing={4}>
                    <ColorModeSwitcher />
                    {auth.user === undefined && <LoginButton></LoginButton>}
                    <RegisterButton></RegisterButton>
                </HStack>
            </Flex>
        </Box>
    )
}

export default Navbar;