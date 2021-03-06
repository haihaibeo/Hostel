import { Box, BoxProps, Button, Center, Flex, useBreakpointValue, useColorModeValue, useMediaQuery, useToast } from '@chakra-ui/react';
import React from 'react'
import DayPicker from 'react-day-picker';
import { DateUtils } from "react-day-picker";
import 'react-day-picker/lib/style.css';

const today = new Date(Date.now());

type PropertySchedule = {
    reservedDates?: {
        fromDate: string;
        toDate: string;
    }[],

    dayOff?: Date[];
}

const defaultSchedules: PropertySchedule = {
    reservedDates: [
        {
            fromDate: "2021-04-19",
            toDate: "2021-04-21"
        },
        {
            fromDate: "2021-04-21",
            toDate: "2021-04-24"
        },
        {
            fromDate: "2021-04-30",
            toDate: "2021-05-01"
        }
    ],
}

export const getDatesBetween = (fromDate: string, toDate: string) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    let datesBtw: Date[] = [];
    let start = from;
    start.setDate(start.getDate() + 1);

    while (start.getDate() < to.getDate()) {
        datesBtw.push(new Date(start));
        start.setDate(start.getDate() + 1);
    }
    return datesBtw;
}

const getDisabledDates = (schedules?: PropertySchedule) => {
    let disabledDates: Date[] = [];

    if (schedules?.reservedDates) {
        for (let i = 0; i < schedules.reservedDates.length; i++) {
            disabledDates.push(...getDatesBetween(schedules.reservedDates[i].fromDate, schedules.reservedDates[i].toDate))
        }
    }

    if (schedules?.dayOff) disabledDates.push(...schedules.dayOff);
    return disabledDates;
}

const getDateCheckOutOnly = (schedules?: PropertySchedule) => {
    return schedules?.reservedDates?.map(r => new Date(r.fromDate));
}

const getNextPossibleDate = (day: Date, schedules?: PropertySchedule) => {
    let nextDay: Date | undefined = undefined;

    if (schedules?.reservedDates) {
        schedules.reservedDates.forEach(r => {
            const rFrom = new Date(r.fromDate);

            if (rFrom > day) {
                if (!nextDay) nextDay = rFrom;
                else if (rFrom <= nextDay) nextDay = rFrom;
            }
        })
    }
    if (nextDay !== day) return nextDay;
    return null;
}

type PickRangeDayState = {
    from?: Date;
    to?: Date;
    enteredTo?: Date; // keep track of the last day for mouseEnter
}

type PickRangeDayProps = {
    from?: Date,
    to?: Date,
    updateDate: (from?: Date, to?: Date) => void,
    schedules?: PropertySchedule
}

const defaultDate: PickRangeDayState = {
    from: undefined,
    to: undefined,
    enteredTo: undefined
}

const PickRangeDay: React.FC<PickRangeDayProps & BoxProps> = (props) => {
    const { from, to, updateDate, schedules, ...boxProps } = props;

    const toast = useToast();
    const [state, setState] = React.useState<PickRangeDayState>({ from: from, to: to });

    const disabled = [
        {
            before: new Date(Date.now())
        },
        ...getDisabledDates(schedules),
    ]

    const [disabledDays, setDisabledDays] = React.useState(disabled)

    React.useEffect(() => {
        if ((state.from && state.to) || (!state.from && !state.to)) {
            updateDate(state.from, state.to);
        }
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

    const handleDayClick = (day: Date, modifiers: any) => {
        if (modifiers.disabled) return;

        const today = new Date(Date.now());
        if (day < today) return;
        const { from, to } = state;
        if (from && to && day >= from && day <= to) {
            handleResetClick();
            return;
        }
        // if selecting first day, recalculate disabled days to this chosen day
        if (isSelectingFirstDay(day, from, to)) {
            if (modifiers.checkoutOnly) {
                toast({
                    status: "info",
                    description: "Check out only!",
                    duration: 3000
                })
                return;
            }
            setDisabledDays((s) => ({ ...s, before: day, after: getNextPossibleDate(day, schedules) }))

            setState({
                from: day,
                to: undefined,
                enteredTo: undefined,
            });
        }
        // else, set every things back to normal
        else {
            setDisabledDays(disabled);
            // prevent from = to
            if (state.from?.getDate() === day.getDate()) {
                setState({
                    from: undefined,
                    to: undefined,
                    enteredTo: undefined,
                });
                return;
            }
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


    const modifiers = {
        start: state.from,
        end: state.enteredTo,
        checkoutOnly: getDateCheckOutOnly(schedules),
    }

    const [enoughFor2MonthsDisplay] = useMediaQuery("(min-width: 600px)");

    return (
        <Box d="flex" flexDir="column" {...boxProps} overflow="clip">
            <Box alignSelf="center">
                <DayPicker
                    numberOfMonths={enoughFor2MonthsDisplay ? 2 : 1}
                    fromMonth={state.from}
                    modifiers={modifiers as any}
                    onDayClick={handleDayClick}
                    disabledDays={disabledDays}
                    onDayMouseEnter={handleDayMouseEnter}
                    selectedDays={selected as any}>
                </DayPicker>
            </Box>
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