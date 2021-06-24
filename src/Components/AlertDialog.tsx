import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, Button, AlertDialogProps, useToast } from '@chakra-ui/react'
import React from 'react'
import { useMutation, useQueryClient } from 'react-query';
import { toggleCloseProperty } from '../API';

interface ActionAlertProps {
    message?: string;
    headerMessage?: string;
    propertyId: string;
    action?: () => void;
}

interface PureActionAlertProps {
    isLoading?: boolean;
    message?: string;
    headerMessage?: string;
    propertyId: string;
    action?: () => void;
}

export const PureActionAlert = (props: PureActionAlertProps & AlertDialogProps) => {
    const { propertyId, isOpen, onClose, action, message, headerMessage, leastDestructiveRef, isLoading, ...alertDialogProps } = props;

    const handleYes = () => {
        if (action) return action;
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
                    <Button colorScheme="red" ml={3} onClick={handleYes} isLoading={isLoading}>
                        Yes
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export const ActionAlert = (props: ActionAlertProps & AlertDialogProps) => {
    const { propertyId, isOpen, onClose, action, message, headerMessage, leastDestructiveRef, ...alertDialogProps } = props;
    const toast = useToast();

    const queryClient = useQueryClient();

    const closePropMutation = useMutation(["property", propertyId], () => {
        return toggleCloseProperty(propertyId)
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
        if (action) return action();
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