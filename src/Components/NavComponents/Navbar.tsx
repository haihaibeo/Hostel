import React from 'react';
import { Box, Button, Center, Flex, Heading, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spacer, useDisclosure } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../../ColorModeSwitcher';
import { Logo } from "../../Logo";
import { Link } from 'react-router-dom';
import Authentication from '../Authentication';

const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

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
                    <Button variant="ghost" onClick={onOpen}>Login</Button>
                    <Button variant="solid" onClick={onOpen}>Register</Button>
                </HStack>
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent minW="40%">
                    <ModalHeader alignSelf="center">Authentication</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w="100%">
                            <Authentication></Authentication>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>

        </Box>
    )
}

export default Navbar;