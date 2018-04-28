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
        const yyyy = date.getFullYear();
        const mm = date.getMonth();
        const dd = date.getDate();
        const day = date.getDay();
        const numOfDays = new Date(yyyy, mm + 1, 0).getDate();
        const daysOffset = (dd % 7 !== day) ? (day - (dd % 7)) : 0;

        /* daysOffet shifts the days of each month in the calendar, so the date starts on the right day
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
        
        if ( direction === 'right' ) {
            this.setState(prevState => {
                date.setMonth( (date.getMonth() + 1) + (prevState.monthOffset + 1) ); // The month is set to a different month depending on the offset
                date.setDate( 1 );  // The default day of the month is the first day of the month
                return { 
                    yyyy: date.getFullYear(),   // Year
                    mm: date.getMonth(),        // Month
                    dd: date.getDate(),         // Day of the Month
                    day: date.getDay(),         // Day of the week
                    numOfDays: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),  // The number of days in the month
                    monthOffset: prevState.monthOffset + 1,  // This value changes the months. Months are offset from the current month
                    daysOffset: (date.getDate() % 7 !== date.getDay()) ? (date.getDay() - (date.getDate() % 7)) : 0  // This value shifts the days of the month so they're on the correct day on the calendar
                }
            });
        } else {
            this.setState(prevState => {
                date.setMonth( (date.getMonth() + 1) + (prevState.monthOffset - 1) );
                date.setDate( 1 );
                return {
                    yyyy: date.getFullYear(),
                    mm: date.getMonth(),
                    dd: date.getDate(),
                    day: date.getDay(),
                    numOfDays: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
                    monthOffset: prevState.monthOffset - 1,
                    daysOffset: (date.getDate() % 7 !== date.getDay()) ? (date.getDay() - (date.getDate() % 7)) : 0
                }
            });
        }
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

    render () {
        const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const weeks = [new Array(days.length), new Array(days.length), new Array(days.length), new Array(days.length), new Array(days.length),new Array(days.length)];
        const calendarDays = new Array(weeks.length * days.length);
        
        const { yyyy, mm, numOfDays, daysOffset, currentDay, selectedDay } = this.state;

        for ( let i = 0; i < weeks.length; i++ ) { 
            for ( let j = 0; j < days.length; j++ ) {
                // The index for all 35 days in the calendar
                const dayIndex = j + (i * 7);

                // If the dayIndex is within the specific month's range of days it will have date number
                if ( dayIndex > daysOffset && dayIndex <= (numOfDays + daysOffset) ) {
                    calendarDays[dayIndex] = dayIndex - daysOffset;
                } else {
                    calendarDays[dayIndex] = '';
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
                            <div className="arrow" onClick={ () => this.handleMonthChange('left') }><img src={ arrowLeft } alt="left arrow"/></div>
                            <div className="month">{ months[mm] } { yyyy }</div>
                            <div className="arrow" onClick={ () => this.handleMonthChange('right') }><img src={ arrowRight } alt="right arrow"/></div>
                        </div>

                        <div className="days">
                            { days.map( (e, i) => <div key={i} className={`day ${i % 2 === 0 ? 'darkGrey' : 'lightGrey'}`}>{ e.slice(0, 3) }</div> ) }
                        </div>

                        <div className="weeks">
                            { weeks.map( (week, i) => (
                            <div key={i} className="week">
                                { week.map( (day, j) => (
                                <div key={j} className={`day-block ${!day ? 'lightCoolGrey': 'white'} ${currentDay.yyyy === yyyy && currentDay.mm === mm && currentDay.dd === day ? 'blueNum' : ''}`} onClick={() => day ? this.selectDay(yyyy,mm,day) : null}>
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