import { Box, Button, Collapse, FormControl, HStack, Input, InputGroup, PinInput, PinInputField, Select, VStack } from '@chakra-ui/react';
import { stat } from 'fs';
import React from 'react'
import { FaArrowRight } from 'react-icons/fa';

type ActionType =
    | { type: "ChangeInput"; country?: string; phone?: string }
    | { type: "RegisterPhone" }
    | { type: "CheckPincode" }
    | { type: "RegisterDetail"; name: string; email: string; password: string }
    | { type: "SetLoading"; isLoading: boolean }
    | { type: "ResetForm"; }


type FormState = {
    country?: string;
    phone?: string;
    name?: string;
    pincode?: string;
    email?: string;
    password?: string;
}

type AuthenticationState = {
    form?: FormState;
    show: "none" | "pin" | "detail"
    isLoading?: boolean;
}

const reducer = (state: AuthenticationState, action: ActionType): AuthenticationState => {
    switch (action.type) {
        case "ChangeInput":
            return {
                ...state,
                form: {
                    ...state.form,
                    country: action.country,
                    phone: action.phone
                }
            }
        case 'RegisterPhone':
            return {
                ...state,
                show: 'pin',
                isLoading: true,
            }
        case 'CheckPincode':
            return {
                ...state,
                show: 'detail',
                isLoading: true
            }
        case 'RegisterDetail':
            return {
                ...state,
            }
        case "SetLoading":
            return {
                ...state,
                isLoading: action.isLoading,
            }
        case "ResetForm":
            return initialState;

        default:
            return {
                ...state,
            }
    }
}

const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

const fetchPincode = async (phone: number) => {
    setTimeout(() => {
        return getRandomInt(1000, 9999);
    }, 1000);
}

const CheckPin = (pin: string) => {
    return new Promise<boolean>((resolve, reject) => {
        if (pin.length === 4)
            setTimeout(() => { resolve(true) }, 1000);
        else
            setTimeout(() => { reject("Pin not correct") }, 1000);
    })
}

const initialState: AuthenticationState = {
    form: {},
    isLoading: false,
    show: "none"
}

const Authentication: React.FC = ({ }) => {
    const [countries, setCountries] = React.useState<string[]>();
    const [state, dispatch] = React.useReducer(reducer, initialState);

    // fetching countries
    React.useEffect(() => {
        setCountries(defaultCountries);
    }, [])

    const handleRegisterButton = async (pin?: string) => {
        if (state.show === "none") {
            dispatch({ type: 'RegisterPhone' })
            // send to api server
            setTimeout(() => {
                dispatch({ type: 'SetLoading', isLoading: false })
            }, 1000)
        }

        else if (state.show === "pin" && pin !== undefined) {
            dispatch({ type: 'SetLoading', isLoading: true })
            CheckPin(pin).then(res => {
                if (res === true) {
                    console.log("Pincode correct");
                    dispatch({ type: 'CheckPincode' })
                }
                else {
                    console.log("Pincode not correct");
                }
            }).catch((r) => {
                console.log(r);
            }).finally(() => {
                dispatch({ type: 'SetLoading', isLoading: false })
            })
        }
    }

    return (
        <FormControl d="flex" flexDir="column">
            <Select borderBottomRadius="0" isDisabled={state.show !== "none"} onChange={(e) => dispatch({ type: 'ChangeInput', country: e.target.value, phone: state.form?.phone })} size="lg" isRequired placeholder="Choose your country">
                {countries?.map((c, index) => {
                    return <option value={c} key={index}>{c}</option>
                })}
            </Select>
            <Input borderTopRadius="0" placeholder="Phone number" isDisabled={state.show !== "none"} size="lg" value={state.form?.phone} onChange={(e) => dispatch({ type: 'ChangeInput', phone: e.target.value, country: state.form?.country })} />

            <Collapse in={state.show === "pin"}>
                <VStack spacing="1" my="2">
                    <Box as="h2"> We've sent you a verification code</Box>
                    <HStack>
                        <PinInput value={state.form?.pincode} isDisabled={state.isLoading} onComplete={(value) => handleRegisterButton(value)}>
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                        </PinInput>
                    </HStack>
                </VStack>
            </Collapse>

            <Collapse in={state.show === "detail"}>
                <Box my="2">
                    <Input borderBottomRadius="0" size="lg" placeholder="Your name" />
                    <Input borderRadius="0" size="lg" placeholder="Email address" />
                    <Input borderTopRadius="0" size="lg" placeholder="Password" />
                </Box>
            </Collapse>

            <Button my="3" w="30%" rounded="full" type="submit" alignSelf="center" isLoading={state.isLoading}
                isDisabled={((state.form?.phone !== undefined && state.form?.phone !== "")
                    && (state.form?.country != null && state.form?.country !== "")) ? false : true}
                title="Next step" onClick={() => handleRegisterButton()}
            >
                <FaArrowRight />
            </Button>
            {/* <Button alignSelf="flex-end" variant="ghost" colorScheme="red" onClick={() => dispatch({ type: "ResetForm" })}>Reset</Button> */}

        </FormControl>
    )
}

const defaultCountries: string[] = [
    "Russia", "Vietnam"
]

export default Authentication;