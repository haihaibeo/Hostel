import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Box, Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import React from 'react'
import { FaArrowRight } from 'react-icons/fa';
import LoginForm from './LoginForm';

const LoginButton = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initRef = React.useRef<HTMLInputElement>(null);

    return (
        <Box>
            <Button variant="ghost" onClick={onOpen}>Login</Button>

            <Modal isOpen={isOpen} onClose={onClose} size="xl" motionPreset="slideInBottom" isCentered initialFocusRef={initRef}>
                <ModalOverlay />

                <ModalContent>
                    <ModalHeader>Login</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb="2">
                        <LoginForm initRef={initRef}></LoginForm>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default LoginButton;