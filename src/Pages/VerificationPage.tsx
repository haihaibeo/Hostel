import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react'
import { useQuery } from 'react-query';
import { fetchPropertiesByPropStatusId } from '../API';

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
        </Box>
    )
}

export default VerificationPage;