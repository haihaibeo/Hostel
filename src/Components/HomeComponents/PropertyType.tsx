import { Box, Flex, Image, Square, VStack } from '@chakra-ui/react';
import React from 'react'
import { Link } from 'react-router-dom';

const PropertyType = () => {
    return (
        <Link to="/rooms">
            <VStack alignItems="start" p="4">
                <Box maxW="sm" maxH="sm">
                    <Image width="inherit" height="inherit" src="https://bit.ly/2Z4KKcF" objectFit="cover"></Image>
                </Box>

                <Box
                    mt="1"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                    isTruncated
                >
                    Apartment
            </Box>
                <Box>
                    <Box as="span" color="gray.500" fontSize="md">
                        100+ rooms
          </Box>
                </Box>
            </VStack>
        </Link>
    )
}

export default PropertyType;