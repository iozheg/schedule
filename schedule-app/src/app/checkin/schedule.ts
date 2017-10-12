import { DateRangeClass, UTCDate } from '../time';

export class Schedule{

    id: number;

    name: string;
    description: string;
    tel_number: string;
    address: string;

    work_days: number;
    work_time_start: UTCDate;
    work_time_end: UTCDate;
    dinner_break_start: UTCDate;
    dinner_break_end: UTCDate;

    time_interval: UTCDate;
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
        this.work_time_start = new UTCDate();
        this.work_time_start.setTime(schedule.work_time_start);
        this.work_time_end = new UTCDate();
        this.work_time_end.setTime(schedule.work_time_end);
        this.dinner_break_start = new UTCDate();
        this.dinner_break_start.setTime(schedule.dinner_break_start);
        this.dinner_break_end = new UTCDate();
        this.dinner_break_end.setTime(schedule.dinner_break_end);
    
        this.time_interval = new UTCDate();
        this.time_interval.setTime(schedule.time_interval);
        this.checkin_amount = schedule.checkin_amount || 'none';
    
        this.active = schedule.active || 'none';
        this.create_date = new Date(schedule.create_date);
    
        this.owner = schedule.owner || 'none';

        this.containsTimeAfterMidnight = this.work_time_start.gte(this.work_time_end);
    //    console.log(this);
    }

    get workTime (): string {
        /*
            Returns work time in format 'hh:mm - hh.mm'.
            If work time is not set than return 'around the clock'.
        */ 

        if(this.work_time_start.getTimeInMinutes() == this.work_time_end.getTimeInMinutes())
            return 'around the clock';

        return this.work_time_start.getTimeString()
                + " - " + this.work_time_end.getTimeString();
    }

    get dinnerTime (): string {
        /*
            Returns dinner time in format 'hh:mm - hh.mm'.
            If work time is not set than return 'no dinner'.
        */ 

        if(this.dinner_break_start.getTimeInMinutes() == this.dinner_break_end.getTimeInMinutes())
            return 'no dinner';
                
        return this.dinner_break_start.getTimeString()
                + " - " + this.dinner_break_end.getTimeString();
    }

    get timeInterval (): string {
        // Return time interval in format 'hh:mm'
        return this.time_interval.getTimeString();
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

    createTimeArray(date: UTCDate){

        console.time('Creation time array');

        this.work_time_start.setOnlyDate(date);
        this.work_time_end.setOnlyDate(date);
     
        if(this.containsTimeAfterMidnight)
            this.work_time_end.add('day', 1);
        
        this.timeRange = new DateRangeClass(
            this.work_time_start, 
            this.work_time_end, 
            this.time_interval
        )

        this.dinner_break_start.setOnlyDate(date);
        this.dinner_break_end.setOnlyDate(date);
        this.timeRange.excludeRange(this.dinner_break_start, this.dinner_break_end);

        console.timeEnd('Creation time array');
    }

    markOccupiedTime(time_list: UTCDate[]){
        time_list.forEach( elem => {
            this.timeRange.excludeDate(elem);
        });
    }
}
