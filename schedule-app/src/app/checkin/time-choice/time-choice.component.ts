import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

import { Schedule } from '../schedule';
import { DateTimeClass, UTCDate } from '../../time';
import { SearchParamService } from '../search-param.service';
import { ScheduleService } from '../../schedule.service';
import { SCHEDULES, getScheduleById } from '../mock-schedules';

@Component({
    //selector: 'selector-name',
    templateUrl: 'time-choice.component.html',
    styleUrls: ['time-choice.component.scss']
})

export class TimeChoiceComponent implements OnInit {

    scheduleId: number;
    selectedSchedule: Schedule;
    selectedDate: UTCDate;
    timeArray: DateTimeClass[];
    selectedTime: string;

    constructor(
    //    private route: ActivatedRoute,
        private router: Router,
        private searchParam: SearchParamService,
        private scheduleService: ScheduleService
    ) { }

    ngOnInit() { 

        // if no schedule id (i.e. url entered manualy) we should return to /schedule
        if(this.searchParam.selectedScheduleId === undefined)
            this.router.navigate(['/schedules']);
        
        else{
            this.scheduleId = this.searchParam.selectedScheduleId;
            this.selectedDate = this.searchParam.date

            this.scheduleService.getScheduleDetailInfo(this.scheduleId)
                .then( schedule => {
                    this.selectedSchedule = schedule;
                    this.selectedSchedule.createTimeArray(this.selectedDate);
                    this.timeArray = this.selectedSchedule.timeRange.dateRange;
                    console.log(this.selectedDate);
                    console.log(this.selectedDate.toISOString());
                })
                .then(() => this.scheduleService.getOccupiedTime(this.scheduleId, this.selectedDate.toISOString())
                    .then(list => { console.log('list: '  + list);this.selectedSchedule.markOccupiedTime(list);})   
                )
                .then(() => {
                    if(this.selectedSchedule.containsTimeAfterMidnight){    
                        let nextDay = new UTCDate(this.selectedDate);
                        nextDay.add('day', 1);
                        this.scheduleService.getOccupiedTime(this.scheduleId, nextDay.toISOString())
                            .then(list => this.selectedSchedule.markOccupiedTime(list))
                    }
                });            
        }
    }

    checkinButtonClick(){
        this.searchParam.time = this.selectedTime;
        this.router.navigate(['/schedules/checkin']);
    }
}