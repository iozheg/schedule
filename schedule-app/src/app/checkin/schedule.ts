import { TimeRangeClass, ExtendedDateClass, DateRangeClass } from '../time';

export class Schedule{

    id: number;

    name: string;
    description: string;
    tel_number: string;
    address: string;

    work_days: number;
    work_time_start: Date;
    work_time_end: Date;
    dinner_break_start: Date;
    dinner_break_end: Date;

    time_interval: Date;
    checkin_amount: number;

    active: Boolean;
    create_date: Date;

    owner: number;

    containsTimeAfterMidnight: boolean;
    timeRange: DateRangeClass;
    dinnerTimeRange: DateRangeClass;

    constructor(schedule){
        this.id = schedule.id;
        
        this.name = schedule.name || 'none';
        this.description = schedule.description || 'none';
        this.tel_number = schedule.tel_number || 'none';
        this.address = schedule.address || 'none';
    
        this.work_days = schedule.work_days || 'none';
        this.work_time_start = ExtendedDateClass.dateSetTime(new Date(), schedule.work_time_start + "");
        this.work_time_end = ExtendedDateClass.dateSetTime(new Date(), schedule.work_time_end + "");
        this.dinner_break_start = ExtendedDateClass.dateSetTime(new Date(), schedule.dinner_break_start + "");
        this.dinner_break_end = ExtendedDateClass.dateSetTime(new Date(), schedule.dinner_break_end + "");
    
        this.time_interval = ExtendedDateClass.dateSetTime(new Date(), schedule.time_interval + "");
        this.checkin_amount = schedule.checkin_amount || 'none';
    
        this.active = schedule.active || 'none';
        this.create_date = new Date(schedule.create_date);
    
        this.owner = schedule.owner || 'none';

        this.containsTimeAfterMidnight = this.work_time_start >= this.work_time_end;
        console.log(this);
    }

    get workTime (): string {
        /*
            Returns work time in format 'hh:mm - hh.mm'.
            If work time is not set than return 'around the clock'.
        */ 

        if(isNaN(this.work_time_start.getTime()) || isNaN(this.work_time_end.getTime()))
            return 'around the clock';

        return this.preceding_0(this.work_time_start)
                + " - " + this.preceding_0(this.work_time_end);
    }

    get dinnerTime (): string {
        /*
            Returns dinner time in format 'hh:mm - hh.mm'.
            If work time is not set than return 'no dinner'.
        */ 

        if(isNaN(this.dinner_break_start.getTime()) || isNaN(this.dinner_break_end.getTime()))
            return 'no dinner';
                
        return this.preceding_0(this.dinner_break_start)
                + " - " + this.preceding_0(this.dinner_break_end);
    }

    get timeInterval (): string {
        // Return time interval in format 'hh:mm'
        return this.preceding_0(this.time_interval);
    }

    get createDate (): string {
        // Return create date in format 'dd.mm.yyyy'
        return this.create_date.getDate() + '.' + this.create_date.getMonth() 
                + '.' + this.create_date.getFullYear();
    }

    get workDays (): string {
        /*
            Returns work days in format 'Mon Tue Wed ...'.
            Using bitmask.
        */ 
        let workDaysString: string = '';

        if (this.work_days == 127)
            return 'without weekends';

        let weekDays = {
            1: 'Mon',
            2: 'Tue',
            4: 'Wed',
            8: 'Thu',
            16: 'Fri',
            32: 'Sat',
            64: 'Sun'
        }

        for (let d in weekDays){
            if(+d & this.work_days)
                workDaysString += weekDays[d] + ' ';
        }

        return workDaysString;
    }
    
    private preceding_0(value: Date): string {
        // Add the preceding '0' to output string if hours or minutes <10
        let hoursStr = value.getHours() < 10 ? '0' + value.getHours() : value.getHours().toString();
        let minutesStr = value.getMinutes() < 10 ? '0' + value.getMinutes() : value.getMinutes().toString();

        return hoursStr + ":" + minutesStr;
    }
/*
    private _setTime(timeString: string): Date{
        " Return Date from string 'hh:mm:ss' "

        let date = new Date();
        try{
            let timeArray = timeString.split(":");
            
            date.setSeconds(0);
            date.setHours(+timeArray[0]);
            date.setMinutes(+timeArray[1]);
        }
        catch(error){
            // If string is not in format 'hh:mm:ss' than
            // return null
            date = null;
        }

        return date;
    }*/

    createTimeArray(date: Date){

        console.time('Creation time array');
/*
        
        if(this.containsTimeAfterMidnight){
            this.work_time_end = ExtendedDateClass.dateSetOnlyDate(
                this.work_time_end, 
                ExtendedDateClass.dateAdd(date, 'day', 1)
            );
        }
        else{
            this.work_time_end = ExtendedDateClass.dateSetOnlyDate(
                this.work_time_end, 
                date
            );
        }*/
        
        this.work_time_start = ExtendedDateClass.dateSetOnlyDate(this.work_time_start, date);
        this.work_time_end = ExtendedDateClass.dateSetOnlyDate(this.work_time_end, date);
     
        if(this.containsTimeAfterMidnight)
            this.work_time_end = ExtendedDateClass.dateAdd(this.work_time_end, 'day', 1);
        
        this.timeRange = new DateRangeClass(
            this.work_time_start, 
            this.work_time_end, 
            this.time_interval
        )

        this.dinner_break_start = ExtendedDateClass.dateSetOnlyDate(this.dinner_break_start, date);
        this.dinner_break_end = ExtendedDateClass.dateSetOnlyDate(this.dinner_break_end, date);
        this.timeRange.excludeRangev2(this.dinner_break_start, this.dinner_break_end);

        console.timeEnd('Creation time array');
    }

    markOccupiedTime(time_list: Date[]){
        console.log(time_list);
        time_list.forEach( elem => {
            this.timeRange.excludeDate(elem);
        });
    }
}
