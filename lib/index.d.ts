import moment from 'moment';
export declare function useDisableStartDate(endTime: moment.Moment | null, duration: number): (startValue: moment.Moment) => boolean;
export declare function useDisableEndDate(startTime: moment.Moment | null, duration: number): (endValue: moment.Moment) => boolean;
export declare function useDisableStartTime(endTime: moment.Moment | null, duration: number): (startValue: moment.Moment | null) => {
    disabledHours: () => number[];
    disabledMinutes: () => number[];
    disabledSeconds: () => number[];
};
export declare function useDisableEndTime(startTime: moment.Moment | null, duration: number): (endValue: moment.Moment | null) => {
    disabledHours: () => number[];
    disabledMinutes: () => number[];
    disabledSeconds: () => number[];
};
