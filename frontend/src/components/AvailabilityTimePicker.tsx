// ...existing code...
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';

type AvailabilityTimePickerProps = {
    value: string | null;
    onChange: (value: string | null) => void;
};

const AvailabilityTimePicker = ({ value, onChange }: AvailabilityTimePickerProps) => {
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
