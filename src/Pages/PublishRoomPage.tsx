import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, BoxProps, Divider, VStack } from '@chakra-ui/layout';
import { Select } from '@chakra-ui/select';
import { Textarea } from '@chakra-ui/textarea';
import React, { FC } from 'react'

const PublishRoomPage: FC<BoxProps> = ({ ...props }) => {

    return (
        <Box d='flex' flexDir="column" mt="10">
            <VStack spacing="8" w="75%" alignSelf="center">
                <Box as="h1" fontSize="3xl" fontWeight="bold" alignSelf="start">Publish your new property</Box>
                <Divider borderColor="currentcolor" />

                {/* Property info */}
                <Box d={{ base: "inline-block", lg: "flex" }} flexDir="row" w="100%" fontWeight="medium">
                    <Box as="h2" fontSize="lg" w={{ base: "100%", lg: "30%" }} mb="5">Property info</Box>

                    <VStack alignItems="start" w="100%">
                        <FormControl isRequired id="prop-name">
                            <FormLabel as="h2" fontSize="md">Property Name</FormLabel>
                            <Input variant="filled" required />
                        </FormControl>
                        <FormControl isRequired id="prop-description">
                            <FormLabel as="h2" fontSize="md">Description</FormLabel>
                            <Input variant="filled" required />
                        </FormControl>
                        <FormControl isRequired id="prop-introduction">
                            <FormLabel as="h2" fontSize="md">Introduction</FormLabel>
                            <Textarea rows={4} required variant="filled" />
                        </FormControl>
                    </VStack>
                </Box>
                <Divider borderColor="currentcolor" />

                {/* Location info */}
                <Box d={{ base: "inline-block", lg: "flex" }} flexDir="row" w="100%" fontWeight="medium">
                    <Box as="h2" fontSize="lg" w={{ base: "100%", lg: "30%" }} mb="5">Location info</Box>
                    <VStack alignItems="start" w="100%">
                        <FormControl isRequired id="prop-country">
                            <FormLabel as="h2" fontSize="md">Country</FormLabel>
                            <Select variant="filled"></Select>
                        </FormControl>
                        <FormControl isRequired id="prop-city">
                            <FormLabel as="h2" fontSize="md">City</FormLabel>
                            <Select variant="filled"></Select>
                        </FormControl>
                        <FormControl isRequired id="prop-address">
                            <FormLabel as="h2" fontSize="md">Address</FormLabel>
                            <Input required variant="filled" />
                        </FormControl>
                        <FormControl id="prop-add-note">
                            <FormLabel as="h2" fontSize="md">Notes <Box as="span" fontStyle="oblique" fontWeight="light">(optional)</Box></FormLabel>
                            <Input variant="filled" />
                        </FormControl>
                    </VStack>
                </Box>
                <Divider borderColor="currentcolor" />

                {/* Services */}
                <Box d={{ base: "inline-block", lg: "flex" }} flexDir="row" w="100%" fontWeight="medium">
                    <Box as="h2" fontSize="lg" w={{ base: "100%", lg: "30%" }} mb="5">Services</Box>

                </Box>
                <Divider borderColor="currentcolor" />

                {/* Pricin */}
                <Box d={{ base: "inline-block", lg: "flex" }} flexDir="row" w="100%" fontWeight="medium">
                    <Box as="h2" fontSize="lg" w={{ base: "100%", lg: "30%" }} mb="5">Pricing</Box>
                </Box>

            </VStack>
        </Box>
    );
}

export default PublishRoomPage;