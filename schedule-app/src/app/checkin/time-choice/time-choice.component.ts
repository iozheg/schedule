import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

import { Schedule } from '../schedule';
import { TimeRangeClass } from '../../time';
import { SearchParamService } from '../search-param.service';
import { SCHEDULES, getScheduleById } from '../mock-schedules';

@Component({
    //selector: 'selector-name',
    templateUrl: 'time-choice.component.html',
    styleUrls: ['time-choice.component.scss']
})

export class TimeChoiceComponent implements OnInit {

    scheduleId: number;
    selectedSchedule: Schedule;
    date: string;
    timeArray: string[];
    selectedTime: string;

    constructor(
    //    private route: ActivatedRoute,
        private router: Router,
        private searchParam: SearchParamService
    ) { }

    ngOnInit() { 

        // if no schedule id (i.e. url entered manualy) we should return to /schedule
        if(this.searchParam.selectedScheduleId === undefined)
            this.router.navigate(['/schedules']);
        
        else{
            this.scheduleId = this.searchParam.selectedScheduleId;
        //    this.date = this.searchParam.date;

            this.selectedSchedule = getScheduleById(this.scheduleId);

            let timeRange = new TimeRangeClass(this.selectedSchedule.workTime);
            this.timeArray = timeRange.getTimeRangeStringArray(this.selectedSchedule.timeInterval);
        }
    }

    checkinButtonClick(){
        this.searchParam.time = this.selectedTime;
        this.router.navigate(['/schedules/checkin']);
    }
}