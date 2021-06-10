import React, { FC } from 'react';
import { Box, BoxProps, Button, Center, DarkMode, Flex, Heading, HStack, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spacer, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../../ColorModeSwitcher';
import { Logo } from "../../Logo";
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import { BsBell, BsBookmark, BsBoxArrowDown, BsCalendar, BsChevronDown, BsHouse, BsLock, BsPerson } from 'react-icons/bs';
import LoginForm from '../LoginForm';

const Navbar: FC<BoxProps> = ({ ...props }) => {
    const auth = React.useContext(AuthContext);
    const loginFormModal = useDisclosure();
    const initRef = React.useRef<HTMLInputElement>(null);
    const [isRegistering, setIsRegistering] = React.useState(false);

    // check if we are at homepage, then do a bit of theme modification
    const { pathname } = useLocation();
    const bgColorMenuWhenHome = useColorModeValue("gray.800", "gray.800");
    const colorMenuWhenHome = useColorModeValue("white", "white");

    const becomehostColor = useColorModeValue("cyan.200", "blue.400");

    return (
        <Box marginBottom={["5%"]} {...props}>
            <Flex justifyContent="center" alignItems="center">
                <RouterLink to="/">
                    <HStack spacing={4}>
                        <Center>
                            <Logo />
                        </Center>
                        <Heading size="md" display={{ base: "none", sm: "block" }}>Nice homestays</Heading>
                    </HStack>
                </RouterLink>
                <Spacer />
                <HStack spacing={4}>
                    <ColorModeSwitcher />
                    {auth.user === undefined ?
                        <>
                            <Button variant="ghost" onClick={() => { loginFormModal.onOpen(); setIsRegistering(false); }}>Login</Button>
                            <Modal isOpen={loginFormModal.isOpen} onClose={loginFormModal.onClose} size="xl" motionPreset="slideInBottom" isCentered initialFocusRef={initRef}>
                                <ModalOverlay />

                                <ModalContent>
                                    <ModalHeader>{isRegistering ? "Sign up new account" : "Login"}</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody pb="2">
                                        <LoginForm initRef={initRef} isRegistering={isRegistering}></LoginForm>
                                    </ModalBody>
                                </ModalContent>
                            </Modal>
                            <Button variant="ghost" onClick={() => { loginFormModal.onOpen(); setIsRegistering(true); }}>Register</Button>
                        </> :
                        <>
                            <Menu>
                                <MenuButton as={Button} variant="ghost" rightIcon={<BsChevronDown />}>
                                    {auth.user.name}
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
                                        Notifications
                                    </MenuItem>
                                    <MenuDivider />
                                    {auth.user.roles?.includes("Owner") ?
                                        <>
                                            <MenuItem as={RouterLink} to="/host/publish">
                                                <Box mr="3"><BsLock /></Box>
                                        Host your property
                                        </MenuItem>
                                            <MenuItem as={RouterLink} to="/host/properties">
                                                <Box mr="3"><BsHouse /></Box>
                                        Your properties
                                        </MenuItem>
                                        </>
                                        :
                                        <MenuItem bg={becomehostColor} as={RouterLink} to="/user/register-host">
                                            <Box mr="3"><BsLock /></Box>
                                        Become a host
                                        </MenuItem>
                                    }
                                    <MenuItem as={RouterLink} to="/">
                                        <Box mr="3"><BsPerson /></Box>
                                        Account
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