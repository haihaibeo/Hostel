import { Box, Button, Center, Flex } from '@chakra-ui/react';
import React from 'react'
import DayPicker from 'react-day-picker';
import { DateUtils } from "react-day-picker";
import 'react-day-picker/lib/style.css';
type PickRangeDayState = {
    from?: Date;
    to?: Date;
    enteredTo?: Date; // keep track of the last day for mouseEnter
}

type PickRangeDayProps = {
    from?: Date,
    to?: Date,
    updateDate: (from?: Date, to?: Date) => void,
}

const defaultDate: PickRangeDayState = {
    from: undefined,
    to: undefined,
    enteredTo: undefined
}

const PickRangeDay: React.FC<PickRangeDayProps> = ({ from, to, updateDate }) => {
    const [state, setState] = React.useState<PickRangeDayState>({ from: from, to: to });

    React.useEffect(() => {
        updateDate(state.from, state.to);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.from, state.to]);

    const isSelectingFirstDay = (day: Date, from?: Date, to?: Date) => {
        const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
        const isRangeSelected = from && to;
        return !from || isBeforeFirstDay || isRangeSelected;
    }

    const handleDayMouseEnter = (day: Date) => {
        const { from, to } = state;
        if (!isSelectingFirstDay(day, from, to)) {
            setState(s => ({
                ...s,
                enteredTo: day,
            }));
        }
    }

    const handleDayClick = (day: Date) => {
        const today = new Date(Date.now());
        if (day < today) return;
        const { from, to } = state;
        if (from && to && day >= from && day <= to) {
            handleResetClick();
            return;
        }
        if (isSelectingFirstDay(day, from, to)) {
            setState({
                from: day,
                to: undefined,
                enteredTo: undefined,
            });
        } else {
            setState(s => ({
                ...s,
                to: day,
                enteredTo: day,
            }));
        }
    }

    const handleResetClick = () => {
        setState(defaultDate);
    }

    const selected = [state.from, { from: state.from, to: state.enteredTo }];

    const disabled = {
        before: new Date(Date.now())
    }

    const modifiers = {
        start: state.from,
        end: state.enteredTo,
    }

    const modifierStyles = {
        start: {
            backgroundColor: '#19456b',
        },
        end: {
            backgroundColor: '#19456b',
        },
        disable: {
            backgroundColor: '#ffffff',
        }
    }

    return (
        <Box>
            <Center>
                <DayPicker
                    modifiersStyles={modifierStyles}
                    numberOfMonths={2}
                    fromMonth={state.from}
                    modifiers={modifiers as any}
                    onDayClick={handleDayClick}
                    disabledDays={disabled}
                    onDayMouseEnter={handleDayMouseEnter}
                    selectedDays={selected as any}>
                </DayPicker>
            </Center>
            <Flex justifyContent="center" alignItems="center">
                {!state.from && !state.to && 'Please select the first day.'}
                {state.from && !state.to && 'Please select the last day.'}
                {state.from &&
                    state.to &&
                    `Selected from ${state.from.toLocaleDateString()} to
                ${state.to.toLocaleDateString()}`}{' '}
                {state.from && state.to && (
                    <Button onClick={handleResetClick}>
                        Reset
                    </Button>
                )}
            </Flex>
        </Box>
    )
}

export default PickRangeDay;