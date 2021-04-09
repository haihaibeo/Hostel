import React from 'react';
import { Box, Button, Center, Flex, Heading, HStack, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spacer } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../../ColorModeSwitcher';
import { Logo } from "../../Logo";
import { Link as RouterLink } from 'react-router-dom';
import LoginButton from '../LoginButton';
import RegisterButton from '../RegisterButton';
import { AuthContext } from '../../Contexts/AuthContext';
import { BsBell, BsBookmark, BsBoxArrowDown, BsCalendar, BsChevronDown } from 'react-icons/bs';

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
                                        <Box mr={"3"}><BsBookmark /></Box>
                                        Saved rooms
                                    </MenuItem>
                                    <MenuItem as={RouterLink} to="/profile?view=reservations">
                                        <Box mr={"3"}><BsCalendar /></Box>
                                        Your Reservations
                                    </MenuItem>
                                    <MenuItem as={RouterLink} to="/profile?view=notifications">
                                        <Box mr="3"><BsBell /></Box>
                                        {"Notifications"}
                                    </MenuItem>
                                    <MenuDivider />
                                    <MenuItem onClick={() => auth.logoutAsync()}>
                                        <Box mr="3"><BsBoxArrowDown /></Box>
                                        Log Out
                                    </MenuItem>
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