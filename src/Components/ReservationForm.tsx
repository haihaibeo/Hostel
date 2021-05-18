import { useDisclosure, useToast, Box, Flex, Spacer, Popover, PopoverTrigger, HStack, Button, PopoverContent, Collapse, Tooltip, Spinner, Divider } from '@chakra-ui/react';
import React from 'react'
import { BsStarFill, BsStar } from 'react-icons/bs';
import { useQuery, useMutation } from 'react-query';
import { useHistory } from 'react-router';
import { fetchPricing, postReservation } from '../API';
import { AuthContext } from '../Contexts/AuthContext';
import PickRangeDay, { getDatesBetween } from './NavComponents/PickRangeDay';
import PopDetail from './NavComponents/PopDetail';

type FloatingFormProps = {
    room: Room;
    bookInfo: BookingInfo;
    updatePeople: (adult: number, children: number) => void;
    updateDate: (from?: Date | undefined, to?: Date | undefined) => void;
}

const FloatingForm: React.FC<FloatingFormProps> = ({ room, bookInfo, updateDate, updatePeople }) => {
    const auth = React.useContext(AuthContext);
    const history = useHistory();
    const feeCollapse = useDisclosure();
    const [nightCount, setNightCount] = React.useState<number>(0);
    const toast = useToast();

    const checkPricing = useQuery(["pricing", bookInfo], () => {
        if (bookInfo.roomId && bookInfo.bookFromDate && bookInfo.bookToDate) {
            return fetchPricing(bookInfo)
        }
    }, {
        onSuccess: (data) => console.log(data?.data),
        staleTime: 1000 * 60
    })

    const reservMutation = useMutation(postReservation, {
        onSuccess: (data) => {
            toast({ description: "Success", status: "success", isClosable: true });
            history.push("/profile?view=reservations");
        },
        onError: (err) => {
            toast({ description: "Something's wrong", status: "error", isClosable: true });
        }
    });

    const handleCheckout = async () => {
        if (!auth.user) return toast({
            description: "Login is required",
            status: "info",
            isClosable: true
        })
        reservMutation.mutate(bookInfo);
    }

    let price = checkPricing.data?.data;

    React.useEffect(() => {
        if (bookInfo.bookFromDate && bookInfo.bookToDate) {
            setNightCount(getDatesBetween(bookInfo.bookFromDate.toDateString(), bookInfo.bookToDate.toDateString()).length + 1)
            return feeCollapse.onOpen();
        }
        return feeCollapse.onClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookInfo.bookFromDate, bookInfo.bookToDate])

    return (
        <Box display="inline-flex" flexDir="column" alignContent="center" justifyContent="center">
            <Flex alignItems="baseline">
                <Box as="h2" fontFamily="mono" fontSize="3xl" fontWeight="semibold">{room.formattedPrice + "$ "}
                </Box>
                <Box as="span" color="gray.500" fontStyle="italic">
                    / per night
                </Box>
                <Spacer />
                <Box d="flex" alignItems="center">
                    {Array(5).fill("").map((_, i) => {
                        return (i < Math.round(room.totalStar / room.totalReview) ? <BsStarFill key={i} colorRendering="teal.400" /> : <BsStar key={i} />)
                    })}
                </Box>
            </Flex>

            {/* Pop over */}
            <Box mt="4">
                <Popover closeOnBlur={true}>
                    <PopoverTrigger>
                        <HStack spacing="0">
                            <Button variant="outline" borderTopLeftRadius="lg"
                                size="lg" w="100%"
                                _focusVisible={{ border: "0" }}
                                borderRadius="0">
                                {bookInfo?.bookFromDate?.toLocaleDateString() || "From"}
                            </Button>
                            <Button variant="outline" borderTopRightRadius="lg"
                                size="lg" w="100%"
                                _focusVisible={{ border: "0" }}
                                borderRadius="0">
                                {bookInfo?.bookToDate?.toLocaleDateString() || "To"}
                            </Button>
                        </HStack>
                    </PopoverTrigger>
                    <PopoverContent flexWrap="nowrap" alignItems="center" w="550px"
                        style={{ backdropFilter: "blur(5px)" }}
                        borderRadius="0" bg="inherit"
                        bgColor="rgba(66, 153, 225, 0.5)"
                    >
                        <PickRangeDay schedules={{ reservedDates: room.reservedDates, dayOff: room.daysOff }} updateDate={updateDate} />
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger>
                        <Button variant="outline" w="100%" size="lg" borderRadius="0" borderBottomRadius="lg" px="2">{bookInfo.guest + ' guests - ' + bookInfo.children + ' children'}</Button>
                    </PopoverTrigger>
                    <PopoverContent flexWrap="nowrap" borderRadius="0" bg="inherit"
                        bgColor="rgba(66, 153, 225, 0.5)"
                    >
                        <PopDetail updatePeople={updatePeople} guest={bookInfo.guest} children={bookInfo.children} maxGuest={room.maxGuest}></PopDetail>
                    </PopoverContent>
                </Popover>
            </Box>

            <Button variant="solid" colorScheme="green" alignSelf="stretch" mt="4"
                isDisabled={!feeCollapse.isOpen}
                onClick={handleCheckout}
            >
                {!feeCollapse.isOpen ? "Choose dates to see detail" : "Proceed checkout"}
            </Button>
            <Box alignSelf="center" my="2" fontWeight="thin" fontStyle="oblique">You won't be charged yet</Box>

            {/* Fee details */}
            <Collapse in={feeCollapse.isOpen}>
                <Box fontSize="lg">
                    <Flex alignItems="baseline">
                        <Tooltip label={nightCount && `You are currently booking ${price?.nightCount} night(s)`}
                            placement="left" hasArrow>
                            <Box fontWeight="light" textDecoration="underline">{room.formattedPrice}$ x {price?.nightCount} nights</Box>
                        </Tooltip>
                        <Spacer />
                        {checkPricing.isLoading ? <Spinner /> :
                            <Box fontFamily="mono" >{price && `${price?.pricePerNight * price?.nightCount} $`}</Box>
                        }
                    </Flex>
                    <Flex alignItems="baseline">
                        <Tooltip label="The owner keeps your place in highest cleanliness" placement="left" hasArrow>
                            <Box fontWeight="light" textDecoration="underline">Cleaning fee</Box>
                        </Tooltip>
                        <Spacer />
                        {checkPricing.isLoading ? <Spinner /> :
                            <Box fontFamily="mono">{price?.cleaningFee} $</Box>
                        }
                    </Flex>
                    <Flex alignItems="baseline">
                        <Tooltip label="This helps us run our platform and offer services like 24/7 support on your trip. It includes VAT." placement="left" hasArrow>
                            <Box fontWeight="light" textDecoration="underline">Service fee</Box>
                        </Tooltip>
                        <Spacer />
                        {checkPricing.isLoading ? <Spinner /> :
                            <Box fontFamily="mono">{price?.serviceFee} $</Box>
                        }
                    </Flex>
                    <Flex alignItems="baseline">
                        <Tooltip label="We offer you discount based on your reservation!" placement="left" hasArrow>
                            <Box fontWeight="light" textDecoration="underline">
                                Discount
                                <Box as="span" textDecoration="none" mx="2">
                                    {price ? price.discountPercent + "%" : "0%"}
                                </Box>
                            </Box>
                        </Tooltip>
                        <Spacer />
                        {checkPricing.isLoading ? <Spinner /> :
                            <Box fontFamily="mono">{price?.discount} $</Box>
                        }
                    </Flex>
                    <Divider my="2" colorScheme="green" variant="dashed" />
                    <Flex fontWeight="black" fontSize="3xl">
                        <Box fontFamily="mono">Total</Box>
                        <Spacer />
                        {checkPricing.isLoading ? <Spinner /> :
                            <Box fontFamily="mono">{price?.totalCost} $</Box>
                        }
                    </Flex>
                </Box>
            </Collapse>
        </Box>
    )
}

export default FloatingForm;