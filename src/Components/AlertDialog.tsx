import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, Button, AlertDialogProps, useToast } from '@chakra-ui/react'
import React from 'react'
import { useMutation, useQueryClient } from 'react-query';
import { closeProperty } from '../API';

type ActionAlertProps = {
    message?: string;
    headerMessage?: string;
    propertyId: string;
    onDelete?: () => void;
}

export const ActionAlert = (props: ActionAlertProps & AlertDialogProps) => {
    const { propertyId, isOpen, onClose, onDelete, message, headerMessage, leastDestructiveRef, ...alertDialogProps } = props;
    const toast = useToast();

    const queryClient = useQueryClient();

    const closePropMutation = useMutation(["property", propertyId], () => {
        return closeProperty(propertyId)
    }, {
        onSuccess: (rs) => {
            toast({ description: "Successful!", status: "success" });
            queryClient.removeQueries(["property", propertyId]);
        },
        onError: (error) => {
            toast({ description: "Error" + JSON.stringify(error), status: "error" })
        },
        onSettled: () => onClose()
    })

    const handleDelete = () => {
        if (onDelete) return onDelete();
        closePropMutation.mutate();
    }

    return (
        <AlertDialog
            motionPreset="slideInBottom"
            leastDestructiveRef={leastDestructiveRef}
            onClose={onClose}
            isOpen={isOpen}
            isCentered
            {...alertDialogProps}
        >
            <AlertDialogOverlay />

            <AlertDialogContent>
                <AlertDialogHeader>{headerMessage ? headerMessage : "Confirm your action"}</AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                    {message ? message :
                        "Are you sure you want to proceed the action?"}
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button ref={leastDestructiveRef as any} onClick={onClose}>
                        No
                    </Button>
                    <Button colorScheme="red" ml={3} onClick={handleDelete} isLoading={closePropMutation.isLoading}>
                        Yes
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}