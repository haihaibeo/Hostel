import { Flex, Grid, Spacer } from '@chakra-ui/react';
import React from 'react'
import Slider, { Settings } from 'react-slick';
import PropertyType from './PropertyType';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
    return (
        <div>
            <Slider {...settings}>
                <PropertyType></PropertyType>
                <PropertyType></PropertyType>
                <PropertyType></PropertyType>
                <PropertyType></PropertyType>
                <PropertyType></PropertyType>
            </Slider>
        </div>
    )
}

export default PropertyTypeList;