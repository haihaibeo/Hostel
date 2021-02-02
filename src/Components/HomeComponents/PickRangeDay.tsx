import React from 'react'
import DayPicker from 'react-day-picker';
import { DateUtils } from "react-day-picker";

type PickRangeDayState = {
    from?: Date;
    to?: Date;
    enteredTo?: Date; // keep track of the last day for mouseEnter
}

const defaultDate: PickRangeDayState = {
    from: new Date(Date.now()),
    to: new Date(Date.now()),
    enteredTo: new Date(Date.now())
}

const PickRangeDay = () => {
    const [state, setState] = React.useState<PickRangeDayState>(defaultDate);

    const isSelectingFirstDay = (day: Date, from?: Date, to?: Date) => {
        const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
        const isRangeSelected = from && to;
        return !from || isBeforeFirstDay || isRangeSelected;
    }

    const handleDayMouseEnter = (day: Date) => {
        const { from, to } = state;
        if (from && to && !isSelectingFirstDay(day, from, to)) {
            setState({
                enteredTo: day,
            });
        }
    }

    const handleDayClick = (day: Date) => {
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

    React.useEffect(() => {
        console.log("FROM : " + state.from);
        console.log("TO : " + state.to);
        console.log("ENTER TO : " + state.enteredTo);
    })

    return (
        <div>

            <DayPicker
                numberOfMonths={1}
                fromMonth={state.from}
                onDayClick={handleDayClick}
                onDayMouseEnter={handleDayMouseEnter}
                selectedDays={[state.from, state.to]}>
            </DayPicker>
            <div>
                {!state.from && !state.to && 'Please select the first day.'}
                {state.from && !state.to && 'Please select the last day.'}
                {state.from &&
                    state.to &&
                    `Selected from ${state.from.toLocaleDateString()} to
                ${state.to.toLocaleDateString()}`}{' '}
                {state.from && state.to && (
                    <button className="link" onClick={handleResetClick}>
                        Reset
                    </button>
                )}
            </div>
        </div>
    )
}

export default PickRangeDay;