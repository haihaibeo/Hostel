import React from 'react';
import { Box, Button, Center, Flex, Heading, HStack, Menu, MenuButton, MenuItem, MenuList, Spacer } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../../ColorModeSwitcher';
import { Logo } from "../../Logo";
import { Link as RouterLink } from 'react-router-dom';
import LoginButton from '../LoginButton';
import RegisterButton from '../RegisterButton';
import { AuthContext } from '../../Contexts/AuthContext';
import { BsBellFill, BsChevronDown } from 'react-icons/bs';

const Navbar = () => {
    const auth = React.useContext(AuthContext);
    const [user, setUser] = React.useState(auth.user);

    React.useEffect(() => {
        setUser(auth.user);
    }, [auth.user])

    return (
        <Box marginBottom={["5%"]}>
            <Flex justifyContent="center" alignItems="center">
                <RouterLink to="/">
                    <HStack spacing={4}>
                        <Center>
                            <Logo />
                        </Center>
                        <Heading size="md" display={{ base: "none", sm: "block" }}>NiceHostels.com</Heading>
                    </HStack>
                </RouterLink>
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
                                <MenuButton as={Button} variant="ghost" rightIcon={<BsChevronDown />}>
                                    {user.name}
                                </MenuButton>
                                <MenuList>
                                    <MenuItem as={RouterLink} to="/profile?view=likes">
                                        Saved rooms
                                    </MenuItem>
                                    <MenuItem as={RouterLink} to="/profile?view=reservations">
                                        Your Reservations
                                    </MenuItem>
                                    <MenuItem as={RouterLink} to="/profile?view=notifications">
                                        <Box mr="3"><BsBellFill /></Box>
                                        {"Notifications"}
                                    </MenuItem>
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