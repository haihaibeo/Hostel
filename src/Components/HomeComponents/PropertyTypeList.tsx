import { Box, Flex, Grid, Link as ChakraLink, Spacer, VStack, Image, Tooltip, Button } from '@chakra-ui/react';
import React from 'react';
import { Link, useHistory } from "react-router-dom"
import Slider, { Settings } from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { isError, useQuery } from 'react-query';
import { fetchPropertyTypes } from '../../API';

var settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    swipeToSlide: true,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                initialSlide: 2
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
};

const PropertyTypeList = () => {
    const { data, isError, isFetching } = useQuery<unknown, unknown, PropertyTypeType[]>("propertypeList", fetchPropertyTypes, {
        staleTime: 1000 * 60 * 10
    });

    if (isFetching) console.log("refetching prop")

    if (isError) return <Box>Something's wrong</Box>
    return (
        <div>
            <Slider {...settings}>
                {data?.map((d, key) => <PropertyType type={d} key={key} />)}
            </Slider>
        </div>
    )
}

type PropertyTypeProps = {
    type: PropertyTypeType;
}



const PropertyType: React.FC<PropertyTypeProps> = ({ type, children }) => {
    const history = useHistory();

    const handlePropTypeClick = () => {
        history.push({
            pathname: "/rooms",
            state: {
                type: type
            }
        })
    }

    return (
        <VStack alignItems="start" p="4">
            <ChakraLink onClick={handlePropTypeClick}>
                <Tooltip hasArrow placement="top" aria-label={"tooltips"} label={type.description} openDelay={500}>
                    <Box>
                        <Box maxW="sm" maxH="sm" minH="100px">
                            <Image width="inherit" height="inherit" src={type.thumbnailImg} objectFit="cover"></Image>
                        </Box>

                        <Box
                            mt="1"
                            fontWeight="semibold"
                            as="h4"
                            lineHeight="tight"
                            isTruncated
                        >
                            {type.propertyType}
                        </Box>
                    </Box>
                </Tooltip>
            </ChakraLink>
            <Box color="gray.500" fontSize="md">
                {type.count + " " + type.propertyType + ""}
            </Box>
        </VStack>
    )
}

export default PropertyTypeList;