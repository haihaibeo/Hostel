import { Box, Flex, VStack, Text, Spacer, Square, Button, StackDivider } from '@chakra-ui/react';
import React from 'react';

type PopDetailState = {
    guest: number;
    children: number;
}

interface PopDetailProps extends PopDetailState {
    updatePeople: (guest: number, children: number) => void;
    maxGuest?: number;
}

const PopDetail: React.FC<PopDetailProps> = ({ guest, children, updatePeople, maxGuest }) => {
    return (
        <Box p="4" style={{ backdropFilter: "blur(5px)" }}>
            <VStack align="stretch" spacing={4}>
                <Flex alignItems="center">
                    <Text mr="auto" fontSize="md">Guests</Text>
                    <Square border="1px" borderColor="yellow.400">
                        <Button variant="ghost" borderRadius="0" disabled={guest <= 0}
                            onClick={() => updatePeople(--guest, children)}>-</Button>
                    </Square>
                    <Text mx="4" fontSize="md">{guest}</Text>
                    <Square border="1px" borderColor="yellow.400">
                        <Button variant="ghost" borderRadius="0"
                            disabled={maxGuest !== undefined && guest >= maxGuest}
                            onClick={() => updatePeople(++guest, children)}>+</Button>
                    </Square>
                </Flex>
                <Flex alignItems="center">
                    <Text mr="auto" fontSize="md">Children</Text>
                    <Square border="1px" borderColor="yellow.400">
                        <Button variant="ghost" borderRadius="0" disabled={children <= 0 ? true : false}
                            onClick={() => updatePeople(guest, --children)}>-</Button>
                    </Square>
                    <Text mx="4" fontSize="md">{children}</Text>
                    <Square border="1px" borderColor="yellow.400">
                        <Button variant="ghost" borderRadius="0"
                            isDisabled={children >= 5}
                            onClick={() => updatePeople(guest, ++children)}>+</Button>
                    </Square>
                </Flex>
            </VStack>
        </Box>
    )
}

export default PopDetail;