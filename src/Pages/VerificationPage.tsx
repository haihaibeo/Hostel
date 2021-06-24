import { Avatar, Box, BoxProps, Button, ButtonGroup, Divider, Flex, useToast } from '@chakra-ui/react';
import React from 'react'
import { BsCheck } from 'react-icons/bs';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { fetchPropertiesByPropStatusId, rejectProperty, toggleCloseProperty, validateProperty } from '../API';
import { PureActionAlert } from '../Components/AlertDialog';
import RoomCard from '../Components/FilterComponents/RoomCard';

type VerificationPageProps = {

}

const VerificationPage = (props: BoxProps) => {
    const [propStatusId, setPropStatusId] = React.useState<string>()

    const roomQry = useQuery(["notActive", propStatusId], () => {
        return fetchPropertiesByPropStatusId(propStatusId);
    }, {
        onSuccess: (rs) => {

        }
    })


    return (
        <Box {...props}>
            <Flex flexDir="column" gridGap="10" alignItems="center">
                {roomQry.data?.data.map(r => {
                    return (
                        <Box>
                            <Divider my="2" />
                            <NotActiveRoom room={r} key={r.id}></NotActiveRoom>
                        </Box>
                    )
                })}
            </Flex>
        </Box >
    )
}

type NotActiveRoom = {
    room: Room;
}

const NotActiveRoom = (props: NotActiveRoom) => {
    const toast = useToast();
    const { room } = props;

    const queryClient = useQueryClient();

    const closePropMutation = useMutation(["property", room.id], toggleCloseProperty, {
        onSuccess: (rs) => {
            toast({ description: "Successful!", status: "success" });
            queryClient.removeQueries(["property", room.id]);
            window.location.reload();
        },
        onError: (error) => {
            toast({ description: "Error" + JSON.stringify(error), status: "error" })
        },
    })

    const validateMutation = useMutation(validateProperty, {
        mutationKey: ["property", room.id],
        onSuccess: () => {
            toast({
                description: "Room is accepted",
                status: "info",
            });
            queryClient.removeQueries(["property", room.id]);
            window.location.reload();
        },
        onSettled: () => {
        }
    }
    )

    const rejectMutation = useMutation(rejectProperty, {
        mutationKey: ["property", room.id],
        onSuccess: () => {
            toast({
                description: "Room is rejected",
                status: "info",
            });
            queryClient.removeQueries(["property", room.id]);
            window.location.reload();
        }
    })

    const reopenProp = (id: string) => {
        closePropMutation.mutate(id);
    }

    const validate = (id: string) => {
        validateMutation.mutate(id);
    }

    const reject = (id: string) => {
        rejectMutation.mutate(id);
    }

    return (<Box>
        <Flex flexDir="column" maxW='500'>
            <RoomCard key={room.id} room={room} isSaved={true}></RoomCard>
            {room.propertyStatus == 'IsClosed' && <Button colorScheme="green" onClick={() => reopenProp(room.id)}>Reopen this property</Button>}
            {
                room.propertyStatus == 'OnValidation' &&
                <ButtonGroup variant="solid">
                    <Button colorScheme="blue"
                        onClick={() => validate(room.id)}
                        isLoading={validateMutation.isLoading}
                        isDisabled={validateMutation.isSuccess}
                        rightIcon={validateMutation.isSuccess ? <BsCheck /> : <></>}
                    >{"Validate"}</Button>

                    <Button
                        colorScheme="red"
                        onClick={() => reject(room.id)}
                        isLoading={rejectMutation.isLoading}
                    >Reject</Button>
                </ButtonGroup>
            }
            {
                room.propertyStatus == 'IsRejected' &&
                <Button isDisabled={true}>This property has been rejected</Button>
            }
        </Flex>
    </Box>)
}

export default VerificationPage;