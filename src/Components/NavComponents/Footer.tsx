import { Box, Center, Divider } from '@chakra-ui/react'
import React from 'react'
import { BsHeartFill } from 'react-icons/bs';

type FooterProps = {
    height?: string
}

const Footer: React.FC<FooterProps> = ({ height }) => {
    return (
        <Box mt="10" mb="5">
            <Divider mb="5" boxShadow="lg" />
            <Center as="h4">
                {"Made with"}
                <>&nbsp;</>
                <Box as={"a"} href="" cursor="default">
                    <BsHeartFill />
                </Box>
                <>&nbsp;</>
                {"by"}
                <>&nbsp;</>
                <Box as="a" href="https://github.com/haihaibeo">Hai</Box>
            </Center>
        </Box>
    )
}

export default Footer;