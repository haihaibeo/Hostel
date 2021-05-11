import React from 'react'
import PropertyTypeList from '../Components/HomeComponents/PropertyTypeList'
import SearchBar from '../Components/NavComponents/SearchBar';
import { Box, DarkMode, HStack, Spacer, Link } from "@chakra-ui/react"
import BG from "../Images/HomeBG.webp";
import Navbar from '../Components/NavComponents/Navbar';
import { Link as ReactLink } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';


const HomePage = () => {
    const px = "10%";
    return (
        <Box>
            <Box minH={["50vh", "75vh", "85vh"]} style={{ background: "url('" + BG + "') center/cover", }} color="white">
                <Box px={px} pt="5">
                    <Navbar></Navbar>
                    <DarkMode>
                        <SearchBar />
                    </DarkMode>
                    <Box as="h1" fontFamily="mono" textShadow="gray 2px 2px 2px" color="whiteAlpha.600" fontWeight="bold" fontSize={["3xl", "4xl", "6xl", "8xl"]}
                        mt={["5vh", "10vh", "20vh", "30vh"]}>EXPLORE AROUND</Box>
                </Box>
            </Box>
            <Box px={px} mt="10">
                <HStack>
                    <Box as="h2" fontWeight="bold" fontSize="4xl" mb="5">
                        LIVE ANYWHERE
                    </Box>
                    <Spacer />
                    <Link as={ReactLink} to={"/rooms"} d={"flex"} flexDir="row" alignItems="center">All properties <Box ml="2"><BsArrowRight /></Box></Link>
                </HStack>
                <PropertyTypeList></PropertyTypeList>
            </Box>
        </Box>
    )
}
export default HomePage;