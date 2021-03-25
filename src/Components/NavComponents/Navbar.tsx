import React from 'react';
import { Box, Button, Center, Flex, Heading, HStack, Menu, MenuButton, MenuItem, MenuList, Spacer } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../../ColorModeSwitcher';
import { Logo } from "../../Logo";
import { Link } from 'react-router-dom';
import LoginButton from '../LoginButton';
import RegisterButton from '../RegisterButton';
import { AuthContext } from '../../Contexts/AuthContext';
import { BsArrowDown, BsBoxArrowDown } from 'react-icons/bs';
import { FaArrowDown } from 'react-icons/fa';

const Navbar = () => {
    const auth = React.useContext(AuthContext);
    const [user, setUser] = React.useState(auth.user);

    React.useEffect(() => {
        setUser(auth.user);
    }, [auth.user])

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
                    {user === undefined ?
                        <>
                            <LoginButton></LoginButton>
                            <RegisterButton></RegisterButton>
                        </> :
                        <>
                            <Menu>
                                <MenuButton>
                                    <Button variant="ghost" rightIcon={<FaArrowDown />}>
                                        {user.name}
                                    </Button>
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={() => auth.logoutAsync()}>Log Out</MenuItem>
                                </MenuList>
                            </Menu>
                        </>
                    }
                </HStack>
            </Flex>
        </Box>
    )
}

export default Navbar;