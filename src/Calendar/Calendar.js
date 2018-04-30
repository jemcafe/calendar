import React, { Component } from 'react';
import arrowLeft from '../assets/arrow_left.png';
import arrowRight from '../assets/arrow_right.png';

class Calendar extends Component {
    constructor () {
        super();
        this.state = {
            yyyy: 0,
            mm: 0,
            dd: 0,
            day: 0,
            numOfDays: 0,
            monthOffset: -1,
            daysOffset: -1,
            currentDay: {},
            selectedDay: {}
        }
    }

    componentDidMount () {
        // The calendar will always start with the current date
        const date = new Date();
        const yyyy = date.getFullYear();                            // Year
        const mm = date.getMonth();                                 // Month
        const dd = date.getDate();                                  // Day of the month
        const day = date.getDay();                                  // Day of the Week
        const numOfDays = new Date(yyyy, mm + 1, 0).getDate();      // Number of days in the month
        const daysOffset = (dd % 7 !== day) ? (day - (dd % 7)) : 0; // 

        /* daysOffet shifts the days of each month in the calendar, so the date number is on the right day on the calendar
        The ternary checks if the current date in the current week ( % remaining days ) is not equal to the current day
        If it's not, the offset will be the difference between the days remaining and current day
        The default offset value is -1, and 7 is used because there's 7 days in a week. */

        this.setState({ 
            yyyy: yyyy,
            dd: dd,
            mm: mm,
            day: day,
            numOfDays: numOfDays,
            daysOffset: daysOffset,
            currentDay: { yyyy, dd, mm, day },
            selectedDay: { yyyy, dd, mm, day }
        });
    }

    handleMonthChange ( direction ) {
        const date = new Date();
        const offset = direction === 'R' ? 1 : -1;  // This value changes the monthOffset

        this.setState(prevState => {
            const monthOffset = prevState.monthOffset + offset;  // This value changes the months.
            date.setMonth( (date.getMonth() + 1) + monthOffset, 1 );  // .setmonth(month, day)  Months are offset from the current month and the default day is the first day of the month
            const yyyy = date.getFullYear();
            const mm = date.getMonth();
            const dd = date.getDate();
            const day = date.getDay();
            const numOfDays = new Date(yyyy, mm + 1, 0).getDate();
            const daysOffset = (dd % 7 !== day) ? (day - (dd % 7)) : 0;
            return { 
                yyyy,
                mm,
                dd,
                day,
                numOfDays,
                monthOffset,
                daysOffset
            }
        });
    }

    selectDay = ( yyyy, mm, dd ) => {
        const date = new Date();

        // The full year is set to month being viewed. This allows me to get the day of the month
        date.setFullYear( yyyy, mm, dd );

        // selectedDay is set to an object containing the date and the day of the week.
        this.setState({ 
            selectedDay: { yyyy, mm, dd, day: date.getDay() } 
        });
    }

    styleCalendarDay = (day) => {
        const { yyyy, mm, currentDay } = this.state;

        const d = !day ? 'lightCoolGrey': 'white';
        const cd = currentDay.yyyy === yyyy && 
                   currentDay.mm === mm && 
                   currentDay.dd === day ? 'blue' : '';
        
        return `${d} ${cd}`;
    }

    render () {
        // constants
        const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const weeks = new Array(6);
        const calendarDays = new Array(weeks.length * days.length);
        
        // state
        const { yyyy, mm, numOfDays, daysOffset, selectedDay } = this.state;

        // Each week has seven days
        for (let i = 0; i < weeks.length; i++) weeks[i] = new Array(days.length);
        
        // Values are assigned to each item in weeks and calendarDays
        for ( let i = 0; i < weeks.length; i++ ) { 
            for ( let j = 0; j < days.length; j++ ) {
                // The index for each day in the 35 day calendar
                const dayIndex = j + (i * days.length);

                // If the dayIndex falls within the month's range of days it will have date number
                if ( dayIndex > daysOffset && dayIndex <= (numOfDays + daysOffset) ) {
                    calendarDays[dayIndex] = dayIndex - daysOffset;
                } else {
                    calendarDays[dayIndex] = null;
                }

                // Each day in the calendar is given the right date number
                weeks[i][j] = calendarDays[dayIndex];
            }
        }

        return (
            <div className="calendar">
                <div className="container">

                    <h1>Calendar</h1>

                    <div className="calendar-layout">
                        <div className="months">
                            <div className="arrow" onClick={ () => this.handleMonthChange('L') }><img src={ arrowLeft } alt="left arrow"/></div>
                            <div className="month">{ months[mm] } { yyyy }</div>
                            <div className="arrow" onClick={ () => this.handleMonthChange('R') }><img src={ arrowRight } alt="right arrow"/></div>
                        </div>

                        <div className="days">
                            { days.map( (e, i) => ( 
                            <div key={i} className={`day ${i % 2 === 0 ? 'darkGrey' : 'lightGrey'}`}>{ e.slice(0, 3) }</div> 
                            )) }
                        </div>

                        <div className="weeks">
                            { weeks.map((week, i) => (
                            <div key={i} className="week">
                                { week.map((day, j) => (
                                <div key={j} 
                                     className={`day-block ${this.styleCalendarDay(day)}`} 
                                     onClick={() => day ? this.selectDay(yyyy,mm,day) : null}>
                                    { day }
                                </div> 
                                )) }
                            </div>
                            )) }
                        </div>

                        <div className="selected-day">
                            <div className="day-date">
                                <span className="day">{ days[selectedDay.day] }</span> &nbsp; {`${months[selectedDay.mm]} ${selectedDay.dd}, ${selectedDay.yyyy}`}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default Calendar;