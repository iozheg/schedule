export class UTCDate{

    _date: Date;

    constructor(date: any = new Date()){
        if(date instanceof Date)
            this._date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        else if (date instanceof UTCDate)
            this._date = new Date(
                date.date.getFullYear(), 
                date.date.getMonth(), 
                date.date.getDate(),
                date.date.getHours(),
                date.date.getMinutes(),
                date.date.getSeconds()
            );

        
        else if (typeof(date) == 'string'){
            try{
                let datetimeArray = date.split("T");
                let dateArray = datetimeArray[0].split('-');
                let timeArray = datetimeArray[1].split(':');
                this._date = new Date(
                    +dateArray[0], 
                    +dateArray[1]-1, 
                    +dateArray[2],
                    +timeArray[0],
                    +timeArray[1]
                );
            }
            catch(error){
                console.error("Wrong format of ISO date string", date);
            }
        }
    }

    get date(): Date {
        return this._date;
    }

    get time(): number {
        return this._date.getTime();
    }

    get hours(): number {
        return this._date.getHours();
    }

    get minutes(): number {
        return this._date.getMinutes();
    }

    setTime(time: string) {
        try{
            let timeArray = ("" + time).split(":");
            
            this._date.setHours(+timeArray[0]);
            this._date.setMinutes(+timeArray[1]);
            this._date.setSeconds(+timeArray[2]);
        }
        catch(error){
            console.error("Wrong format of time string", time, error);
        }
    }

    setOnlyDate(date: UTCDate){
        this._date.setDate(date._date.getDate());
        this._date.setMonth(date._date.getMonth());
        this._date.setFullYear(date._date.getFullYear());
    }
    
    getTimeInMinutes(): number {
        return this.hours * 60 + this.minutes;
    }

    add(el: string, value: number){
        
        switch (el){
            case 'day':
            this._date.setDate(this._date.getDate() + value);
                break;
            case 'minute':
            this._date.setMinutes(this.minutes + value);
                break;
            case 'hour':
            this._date.setHours(this.hours + value);
                break;
        }
    }

    equal(date: UTCDate): boolean {
        return (this.hours == date.hours
            && this.minutes == date.minutes
            && this._date.getDate() == date._date.getDate()
            && this._date.getMonth() == date._date.getMonth()
            && this._date.getFullYear() == date._date.getFullYear()
        )
    }

    gt(date: UTCDate): boolean {
        return this._date > date.date;
    }

    lt(date: UTCDate): boolean {
        return this._date < date.date;
    }

    gte(date: UTCDate): boolean {
        return this._date >= date.date;
    }

    lte(date: UTCDate): boolean {
        return this._date <= date.date;
    }

    toISOString(): string {
        return this._date.getFullYear()
            + '-' + (this._date.getMonth()+1)
            + '-' + this._date.getDate()
            + 'T' + this.hours
            + ':' + this.minutes
            + ':' + this._date.getSeconds();
    }

    getTimeString(): string {
        
        let hours = this.hours < 10 ? "0" + this.hours : this.hours.toString();
        let minutes = this.minutes < 10 ? "0" + this.minutes : this.minutes.toString();

        return hours + ":" + minutes;
    }
}

export class DateTimeClass{
    date: UTCDate;
    status: string;

    constructor(date: UTCDate){
        this.date = new UTCDate(date);
        this.status = 'active';
    }

    get time(): string {
    
        return this.date.getTimeString();
    }

    get value(): string{
        return this.date.toISOString();
    }
}

export class DateRangeClass{
    rangeStart: DateTimeClass;
    rangeEnd: DateTimeClass;
    dateRange: DateTimeClass[];

    constructor(start: UTCDate, end: UTCDate, interval: UTCDate){

    //    this.rangeStart = new Date(start);

        let intervalInMinutes = interval.date.getHours() * 60 + interval.date.getMinutes();
        let current = new UTCDate(start);
       
    //    console.log(start);
    //    console.log(end);
    //    console.log(current);
        
        let timeArray: DateTimeClass[] = [];
        let i = 0;
        while(current.lt(end) && i < 200){
            timeArray.push(new DateTimeClass(current));
            current.add('minute', intervalInMinutes);
    //        console.log(current);
            i++;
        }

        this.dateRange = timeArray;

        this.rangeStart = timeArray[0];
        this.rangeEnd = timeArray[timeArray.length-1];
    }
    /*
    excludeRange(range: DateRangeClass){
        this.dateRange.forEach(elem =>{
            if(range.isDateIncluded(elem.date))
                elem.status = 'occupied';
        });
    }
    */
    excludeRange(start: UTCDate, end: UTCDate){
        this.dateRange.forEach(elem =>{
            if(elem.date.gte(start) && elem.date.lt(end))
                elem.status = 'occupied';
        });
    }

    excludeDate(date: UTCDate){
        
        this.dateRange.forEach(elem => {
            if(elem.date.equal(date)){
                elem.status = 'occupied';
                return;
            }
        });
    }
    /*
    private isDateIncluded(date: UTCDate){
        return this.rangeStart.date.lt(date)
            && this.rangeEnd.date.gt(date);
    }*/
}