import React from 'react';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';

const AvailabilityTimePicker = ({ value, onChange }) => {
    return (
        <TimePicker
            onChange={onChange}
            value={value}
            disableClock={true}
            clearIcon={null}
            format="HH:mm"
            className="availability-time-picker"
        />
    );
};

export default AvailabilityTimePicker;
