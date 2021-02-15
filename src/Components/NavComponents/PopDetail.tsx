import { Box, Flex, VStack, Text, Spacer, Square, Button, StackDivider } from '@chakra-ui/react';
import React from 'react';

type PopDetailState = {
    adult: number;
    children: number;
    bedRoom: number;
}

interface PopDetailProps extends PopDetailState {
    updatePeople: (adult: number, children: number, room: number) => void;
}

const PopDetail: React.FC<PopDetailProps> = ({ adult, children, bedRoom, updatePeople }) => {
    return (
        <div>
            <Box p="4" style={{ backdropFilter: "blur(5px)" }}>
                <VStack align="stretch" spacing={4}>
                    <Flex alignItems="center">
                        <Text mr="auto" fontSize="md">Adult</Text>
                        <Square border="1px" borderColor="yellow.400">
                            <Button variant="ghost" borderRadius="0" disabled={adult <= 1 ? true : false}
                                onClick={() => updatePeople(--adult, children, bedRoom)}>-</Button>
                        </Square>
                        <Text mx="4" fontSize="md">{adult}</Text>
                        <Square border="1px" borderColor="yellow.400">
                            <Button variant="ghost" borderRadius="0"
                                onClick={() => updatePeople(++adult, children, bedRoom)}>+</Button>
                        </Square>
                    </Flex>
                    <Flex alignItems="center">
                        <Text mr="auto" fontSize="md">Children</Text>
                        <Square border="1px" borderColor="yellow.400">
                            <Button variant="ghost" borderRadius="0" disabled={children <= 0 ? true : false}
                                onClick={() => updatePeople(adult, --children, bedRoom)}>-</Button>
                        </Square>
                        <Text mx="4" fontSize="md">{children}</Text>
                        <Square border="1px" borderColor="yellow.400">
                            <Button variant="ghost" borderRadius="0"
                                onClick={() => updatePeople(adult, ++children, bedRoom)}>+</Button>
                        </Square>
                    </Flex>
                    <Flex alignItems="center">
                        <Text mr="auto" fontSize="md">Room</Text>
                        <Square border="1px" borderColor="yellow.400">
                            <Button variant="ghost" borderRadius="0" disabled={bedRoom <= 1 ? true : false}
                                onClick={() => updatePeople(adult, children, --bedRoom)}>-</Button>
                        </Square>
                        <Text mx="4" fontSize="md">{bedRoom}</Text>
                        <Square border="1px" borderColor="yellow.400">
                            <Button variant="ghost" borderRadius="0"
                                onClick={() => updatePeople(adult, children, ++bedRoom)}>+</Button>
                        </Square>
                    </Flex>
                </VStack>
            </Box>
        </div>
    )
}

export default PopDetail;