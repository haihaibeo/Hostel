import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React from 'react'
import RegisterForm from './RegisterForm';

const RegisterButton = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box>
            <Button variant="solid" onClick={onOpen}>Register</Button>
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Register your account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w="100%">
                            <RegisterForm></RegisterForm>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default RegisterButton;