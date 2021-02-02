import { Button, Grid, GridItem, Input, InputGroup, InputLeftElement, Popover, PopoverContent, PopoverTrigger } from '@chakra-ui/react';
import React from 'react';
import { BsSearch } from 'react-icons/bs';
import 'react-day-picker/lib/style.css';
import PickRangeDay from './PickRangeDay';

type SearchBarProps = {
    country: string;
    city: string;
    checkInDate: string;
    checkOutDate: string;
    adultNum: number;
    childrenNum: number;
}

const SearchBar = () => {
    return (<div>
        <Grid templateColumns="repeat(12, 1fr)" gap={2}>
            <GridItem colSpan={4}>
                <InputGroup>
                    <InputLeftElement pointerEvents="none" children={<BsSearch />} />
                    <Input placeholder="Country" size="lg" />
                </InputGroup>
            </GridItem>
            <GridItem colSpan={3}>
                <Popover closeOnBlur={true}>
                    <PopoverTrigger>
                        <Button variant="outline" size="lg">Choose date</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PickRangeDay />
                    </PopoverContent>
                </Popover>
            </GridItem>
            <GridItem colSpan={4}>
                <Input placeholder="Size" size="lg" />
            </GridItem>
            <GridItem colSpan={1}>
                <Button size="lg">Search</Button>
            </GridItem>
        </Grid>

    </div>)
}

export default SearchBar;