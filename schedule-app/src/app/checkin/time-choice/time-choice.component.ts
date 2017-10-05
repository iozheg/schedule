import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap} from '@angular/router';

import { Schedule } from '../schedule';
import { TimeRangeClass } from '../../time';
import { SCHEDULES, getScheduleById } from '../mock-schedules';

@Component({
    //selector: 'selector-name',
    templateUrl: 'time-choice.component.html',
    styleUrls: ['time-choice.component.scss']
})

export class TimeChoiceComponent implements OnInit {

    scheduleId: string;
    selectedSchedule: Schedule;
    date: string;
    timeArray: string[];

    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit() { 
        this.scheduleId = this.route.snapshot.paramMap.get('scheduleId') || 'none';
        this.date = this.route.snapshot.paramMap.get('date') || 'none';

        this.selectedSchedule = getScheduleById(+this.scheduleId);

        let timeRange = new TimeRangeClass(this.selectedSchedule.workTime);
        this.timeArray = timeRange.getTimeRangeStringArray(this.selectedSchedule.timeInterval);
        

    }
}