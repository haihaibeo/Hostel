import { Box, BoxProps, Center, chakra, Divider, Heading, HeadingProps, Text, HTMLChakraProps, Link, SimpleGrid, SimpleGridProps, Stack, StackDivider, TextProps, useColorModeValue, useToken, ButtonGroup, IconButton, ButtonGroupProps } from '@chakra-ui/react'
import React from 'react'
import { BsHeartFill } from 'react-icons/bs';
import { FaGithub, FaFacebook, FaReddit } from 'react-icons/fa';
// import { Logo } from '../../Logo';

const Footer: React.FC<BoxProps> = ({ children, ...props }) => {
    return (
        <Box as="footer" role="contentinfo" py="12" {...props}>
            <Stack spacing="10" divider={<StackDivider />}>
                {/* <Stack direction={{ base: 'column', lg: 'row' }} spacing={{ base: '10', lg: '28' }}>
                    <Box flex="1">
                        <Logo />
                    </Box>
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: '10', md: '20' }}>
                        <LinkGrid spacing={{ base: '10', md: '20', lg: '28' }} flex="1" />
                    </Stack>
                </Stack> */}
                <Stack
                    direction={{ base: 'column-reverse', md: 'row' }}
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Copyright />
                    <SocialMediaLinks />
                </Stack>
            </Stack>
        </Box>
    )
}

const Copyright = (props: TextProps) => (
    <Text fontSize="sm" {...props}>
        &copy; {new Date().getFullYear()} Hai, Inc. All rights reserved.
    </Text>
)

const openSocio = (to: "fb" | "github" | "reddit") => {
    let url = "";
    if (to === "fb") url = "https://facebook.com";
    else if (to === "github") url = "https://github.com/haihaibeo";
    else if (to === "reddit") url = "https://reddit.com/user/haihaibeo";

    window.open(url, '_blank')!.focus();
}

const SocialMediaLinks = (props: ButtonGroupProps) => (
    <ButtonGroup variant="ghost" color="gray.600" {...props}>
        <IconButton as="a" href="#" aria-label="Facebook" onClick={() => openSocio('fb')} icon={<FaFacebook fontSize="20px" />} />
        <IconButton as="a" href="#" aria-label="GitHub" onClick={() => openSocio('github')} icon={<FaGithub fontSize="20px" />} />
        <IconButton as="a" href="#" aria-label="Reddit" onClick={() => openSocio('reddit')} icon={<FaReddit fontSize="20px" />} />
    </ButtonGroup>
)

export default Footer;