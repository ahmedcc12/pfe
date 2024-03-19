import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CustomCalendar = ({ onSelect }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
        onSelect(date);
    };

    return (
        <div className=' top-0 left-0 w-full h-full flex items-center justify-center bg-white-500 bg-opacity-50 z-50'>
            <div className='bg-white p-4 rounded-lg'>
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                //minDate={new Date()}
                />
            </div>
        </div>
    );
};

export default CustomCalendar;
