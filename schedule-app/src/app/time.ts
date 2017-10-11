export class TimeClass{

    /*
        Time class for handling time using only hours and minutes.
    */

    private hours: number;
    private minutes: number;
    
    constructor(timeString: string){
        /*
            Receives time in format 'hours:minutes' and parses to hours and minutes.
        */
        let timeArray = timeString.split(":");
        this.hours = +timeArray[0];
        this.minutes = +timeArray[1];
    }

	add(time: TimeClass){
        // Add time to current object.

        let hours: number;
        let minutes: number;

        // Sum minutes and get hours and minutes
        hours = Math.floor( ( (this.toMinutes() + time.toMinutes()) / 60 ) % 24);
        minutes = (this.toMinutes() + time.toMinutes()) % 60;

        this.hours = hours;
        this.minutes = minutes;
    }
    
    greaterThan(time: TimeClass): boolean {
        return this.toMinutes() > time.toMinutes();
    }

    lessThan(time: TimeClass): boolean {
        return this.toMinutes() < time.toMinutes();
    }

	toMinutes(): number{
		return this.hours * 60 + this.minutes;
	}
	
	toString(): string {

		let hours: string;
        let minutes: string;
        
        hours = this.hours < 10 ? "0" + this.hours : this.hours.toString();
        minutes = this.minutes < 10 ? "0" + this.minutes : this.minutes.toString();

		return hours + ":" + minutes;
	}
}

export class TimeRangeClass {
    /*
        Class for handling time ranges
    */

    private startTime: TimeClass;
    private endTime: TimeClass;
    private duration: number;
    private dinnerTimeStart: TimeClass;
    private dinnerTimeEnd: TimeClass;

    constructor(timeRangeString: string, dinnerRangeString: string){
        /*
            Receives two time strings and parses it to two TimeClass properties.
            If the end of the time range is after midnight than afterMidnight is true.
        */
        
        let timeArray = timeRangeString.split('-');
        this.startTime = new TimeClass(timeArray[0]);
        this.endTime = new TimeClass(timeArray[1]);

        try{
            let dinnerTimeArray = dinnerRangeString.split('-');
            this.dinnerTimeStart = new TimeClass(dinnerTimeArray[0]);
            this.dinnerTimeEnd = new TimeClass(dinnerTimeArray[1]);
        }
        catch(e){
            this.dinnerTimeStart = this.dinnerTimeEnd = null;
        }
           
        if(this.startTime.toMinutes() >= this.endTime.toMinutes()) {
            this.duration = this.endTime.toMinutes() + (1440 - this.startTime.toMinutes());
        }
        else {
            this.duration = this.endTime.toMinutes() - this.startTime.toMinutes();
        }
    }

    getTimeRangeStringArray(timeInterval: string): string[]{
        /*
            Returns array of strings that contain time in format 'hh:mm'.
            Array starts with start time of time range. Strings are generated
            with interval 'timeInterval'.
        */

        let array: string[] = [];
        let interval = new TimeClass(timeInterval);
        let currentTime = new TimeClass(this.startTime.toString());
        let currentDuration = 0;

        while(true){
            // If schedule has dinner we exclude dinner time from array
            if(this.dinnerTimeStart == null || this.dinnerTimeStart == null
                || currentTime.lessThan(this.dinnerTimeStart) 
                || currentTime.greaterThan(this.dinnerTimeEnd))
                {
                    array.push(currentTime.toString());
                }

            
            currentTime.add(interval);
            
            // Count current duration from the start of generation.
            // Break if current duration greater than total duration of time range.
            currentDuration += interval.toMinutes();
            if(currentDuration > this.duration)
                break;
        }
        return array;
    }
}

export class ExtendedDateClass{
    static dateSetTime(date: Date, time: string): Date {

        let newDate = new Date(date);
        
        try{
            let timeArray = time.split(":");
            
            newDate.setHours(+timeArray[0]);
            newDate.setMinutes(+timeArray[1]);
            newDate.setSeconds(+timeArray[2]);
        }
        catch(error){
            // If string is not in format 'hh:mm:ss' than
            // return null
            newDate = null;
        }
    
        return newDate;
    }

    static dateSetOnlyDate(oldDate: Date, newDate: Date): Date {

        let date = new Date(oldDate);

        date.setDate(newDate.getDate());
        date.setMonth(newDate.getMonth());
        date.setFullYear(newDate.getFullYear());

        return date;
    }

    static dateAdd(date: Date, el: string, value: number): Date{
        
        let newDate = new Date(date);

        switch (el){
            case 'day':
            newDate.setDate(date.getDate() + value);
                break;
            case 'minute':
            newDate.setMinutes(date.getMinutes() + value);
                break;
            case 'hour':
            newDate.setHours(date.getHours() + value);
                break;
        }
        return newDate;
    }

    static equal(date1: Date, date2: Date): boolean {
        return (date1.getHours() == date2.getHours()
            && date1.getMinutes() == date2.getMinutes()
            && date1.getDate() == date2.getDate()
            && date1.getMonth() == date2.getMonth()
            && date1.getFullYear() == date2.getFullYear()
        )
    }
}

export class DateTimeClass{
    date: Date;
    status: string;

    constructor(date: Date){
        this.date = new Date(date);
        this.status = 'active';
    }

    get time(): string {
        
        let hours: string;
        let minutes: string;
        
        hours = this.date.getHours() < 10 ? "0" + this.date.getHours() : this.date.getHours().toString();
        minutes = this.date.getMinutes() < 10 ? "0" + this.date.getMinutes() : this.date.getMinutes().toString();

        return hours + ":" + minutes;
    }

    get value(): string{
        return this.date.getFullYear() + '-'
            + this.date.getMonth() + '-'
            + this.date.getDate() + 'T'
            + this.date.getHours() + ':'
            + this.date.getMinutes() + ':'
            + this.date.getSeconds();
    }
}

export class DateRangeClass{
    rangeStart: DateTimeClass;
    rangeEnd: DateTimeClass;
    dateRange: DateTimeClass[];

    constructor(start: Date, end: Date, interval: Date){

    //    this.rangeStart = new Date(start);

        let intervalInMinutes = interval.getHours() * 60 + interval.getMinutes();
        let current = new Date(start);
       
        let timeArray: DateTimeClass[] = [];
        let i = 0;
        while(current < end && i < 200){
            timeArray.push(new DateTimeClass(current));
            current = ExtendedDateClass.dateAdd(current, 'minute', intervalInMinutes);
            i++;
        }

        this.dateRange = timeArray;

        this.rangeStart = timeArray[0];
        this.rangeEnd = timeArray[timeArray.length-1];
    }

    excludeRange(range: DateRangeClass){
        this.dateRange.forEach(elem =>{
            if(range.isDateIncluded(elem.date))
                elem.status = 'occupied';
        });
    }

    excludeRangev2(start: Date, end: Date){
        this.dateRange.forEach(elem =>{
            if(elem.date >= start && elem.date < end)
                elem.status = 'occupied';
        });
    }

    excludeDate(date: Date){
        
        this.dateRange.forEach(elem => {
            if(ExtendedDateClass.equal(elem.date, date)){
                elem.status = 'occupied';
                return;
            }
        });
    }

    private isDateIncluded(date: Date){
        return (this.rangeStart.date < date && this.rangeEnd.date > date);
    }
}