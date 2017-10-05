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

    constructor(timeRangeString: string){
        /*
            Receives two time strings and parses it to two TimeClass properties.
            If the end of the time range is after midnight than afterMidnight is true.
        */
        
        let timeArray = timeRangeString.split('-');
        this.startTime = new TimeClass(timeArray[0]);
        this.endTime = new TimeClass(timeArray[1]);
           
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
            array.push(currentTime.toString());
            currentTime.add(interval);
            
            // Count current duration from the start of generation.
            // Break if current duration greater than total duration of time range.
            currentDuration += interval.toMinutes();
            if(currentDuration > this.duration)
                break;
        }
        return array;
    }
/*
	EndTimeInMinutes = function(){
		return this.startTime.toMinutes() + this.duration;
	}
	
	Contains = function(timeInterval)
	{		
		if(this.startTime.toMinutes() <= timeInterval.startTime.toMinutes() && this.startTime.toMinutes() < timeInterval.EndTimeInMinutes() &&
			this.EndTimeInMinutes() > timeInterval.startTime.toMinutes() && this.EndTimeInMinutes() >= timeInterval.EndTimeInMinutes())
			return true;
		else
			return false;
	}
	
	ContainsTime = function(time)
	{
		var timeInMinutes = time.toMinutes();
		var startTimeInMinutes = this.startTime.toMinutes();
		var endTimeInMinutes = this.endTime.toMinutes();
		var endTotalTimeInMinutes = startTimeInMinutes + this.duration;
		
		if(startTimeInMinutes <= timeInMinutes && timeInMinutes < endTotalTimeInMinutes || timeInMinutes == endTotalTimeInMinutes )
			return true;
		else if(timeInMinutes <= startTimeInMinutes && timeInMinutes <= endTimeInMinutes && startTimeInMinutes > endTimeInMinutes)
			return true;
		
		return false;
	}
	
	IsAroundTheClock = function(){
		return this.startTime.getStringTime() == this.endTime.getStringTime();
	}*/
}