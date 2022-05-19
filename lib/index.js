import { useCallback } from "react";
import { range } from "lodash";
import moment from 'moment';
const restDate = (day) => {
    return moment(day)
        .hour(0)
        .minutes(0)
        .seconds(0)
        .milliseconds(0);
};
const resetByOther = (day1, day2) => {
    const other = day2;
    return moment(day1)
        .hours(other.hours())
        .minutes(other.minutes())
        .seconds(other.seconds())
        .milliseconds(other.milliseconds());
};
const isOneDay = (day1, day2) => {
    return !restDate(day1).isAfter(restDate(day2)) &&
        !restDate(day1).isBefore(restDate(day2));
};
export function useDisableStartDate(endTime, duration) {
    return useCallback((startValue) => {
        if (restDate(startValue).isAfter(restDate(moment()))) {
            return true;
        }
        if (!endTime) {
            return false;
        }
        if (resetByOther(startValue, endTime)
            .isBefore(moment(endTime).add('days', -duration))) {
            return true;
        }
        return restDate(startValue).isAfter(restDate(endTime));
    }, [endTime, duration]);
}
export function useDisableEndDate(startTime, duration) {
    return useCallback((endValue) => {
        if (restDate(endValue).isAfter(restDate(moment()))) {
            return true;
        }
        if (!startTime) {
            return false;
        }
        if (resetByOther(endValue, startTime)
            .isAfter(moment(startTime).add('days', duration))) {
            return true;
        }
        return restDate(endValue).isBefore(restDate(startTime));
    }, [startTime, duration]);
}
export function useDisableStartTime(endTime, duration) {
    return useCallback((startValue) => {
        if (!startValue) {
            return {
                disabledHours: () => [],
                disabledMinutes: () => [],
                disabledSeconds: () => [],
            };
        }
        let disabledHours = null;
        let disabledMinutes = null;
        let disabledSeconds = null;
        if (endTime) {
            const limitDate = moment(endTime).add('days', -duration);
            if (isOneDay(limitDate, startValue) || isOneDay(endTime, startValue)) {
                disabledHours = endTime.hours();
                disabledMinutes = endTime.minutes();
                disabledSeconds = endTime.seconds();
            }
        }
        if (endTime && isOneDay(startValue, endTime)) {
            return {
                disabledHours: () => range(disabledHours + 1, 24),
                disabledMinutes: () => startValue.hours() !== disabledHours ? [] : range(disabledMinutes + 1, 60),
                disabledSeconds: () => (startValue.hours() !== disabledHours || startValue.minutes() !== disabledMinutes) ?
                    [] : range(disabledSeconds + 1, 60),
            };
        }
        return {
            disabledHours: () => disabledHours === null ? [] : range(0, disabledHours),
            disabledMinutes: () => (disabledMinutes === null || startValue.hours() !== disabledHours) ?
                [] : range(0, disabledMinutes),
            disabledSeconds: () => (disabledSeconds === null || startValue.hours() !== disabledHours || startValue.minutes() !== disabledMinutes) ?
                [] : range(0, disabledSeconds),
        };
    }, [endTime, duration]);
}
export function useDisableEndTime(startTime, duration) {
    return useCallback((endValue) => {
        if (!endValue) {
            return {
                disabledHours: () => [],
                disabledMinutes: () => [],
                disabledSeconds: () => [],
            };
        }
        let disabledHours = null;
        let disabledMinutes = null;
        let disabledSeconds = null;
        const current = moment();
        if (isOneDay(current, endValue)) {
            disabledHours = current.hours();
            disabledMinutes = current.minutes();
            disabledSeconds = current.seconds();
        }
        if (startTime) {
            const limitDate = moment(startTime).add('days', duration);
            if (!limitDate.isAfter(current) && isOneDay(endValue, limitDate)) {
                disabledHours = startTime.hours();
                disabledMinutes = startTime.minutes();
                disabledSeconds = startTime.seconds();
            }
            if (isOneDay(startTime, endValue)) {
                disabledHours = startTime.hours();
                disabledMinutes = startTime.minutes();
                disabledSeconds = startTime.seconds();
            }
        }
        if (startTime && isOneDay(endValue, startTime)) {
            return {
                disabledHours: () => range(0, disabledHours),
                disabledMinutes: () => endValue.hours() !== disabledHours ? [] : range(0, disabledMinutes),
                disabledSeconds: () => (endValue.hours() !== disabledHours || endValue.minutes() !== disabledMinutes) ?
                    [] : range(0, disabledSeconds),
            };
        }
        return {
            disabledHours: () => disabledHours === null ? [] : range(disabledHours + 1, 24),
            disabledMinutes: () => (disabledMinutes === null || endValue.hours() !== disabledHours) ?
                [] : range(disabledMinutes + 1, 60),
            disabledSeconds: () => (disabledSeconds === null || endValue.hours() !== disabledHours || endValue.minutes() !== disabledMinutes) ?
                [] : range(disabledSeconds + 1, 60),
        };
    }, [startTime, duration]);
}
