import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

import { Schedule } from '../schedule';
import { TimeRangeClass, DateTimeClass, ExtendedDateClass } from '../../time';
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
    selectedDate: Date;
    timeArray: DateTimeClass[];
    selectedTime: string;
    ready: boolean = false;

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
                })
                .then(() => this.scheduleService.getOccupiedTime(this.scheduleId, this.selectedDate.toISOString())
                    .then(list => this.selectedSchedule.markOccupiedTime(list))   
                )
                .then(() => {
                    if(this.selectedSchedule.containsTimeAfterMidnight){                        
                        this.scheduleService.getOccupiedTime(this.scheduleId, ExtendedDateClass.dateAdd(this.selectedDate, 'day', 1).toISOString())
                            .then(list => this.selectedSchedule.markOccupiedTime(list))
                    }
                });
            
/*
            if(this.selectedSchedule.work_time_start > this.selectedSchedule.work_time_end){

                this.scheduleService.getOccupiedTime(this.scheduleId, this.date, true)
                    .then(list => console.log(list)); 
            }*/
/*
            this.scheduleService.getAvailableTimeForCheckin(this.scheduleId, this.date)
                .then( time_list => this.timeArray = time_list);*/
        //    this.date = this.searchParam.date;

            
        }
    }
/*
    createTimeArray(): void {
        let timeRange = new TimeRangeClass(
            this.selectedSchedule.workTime, 
            this.selectedSchedule.dinnerTime
        );
        this.timeArray = timeRange.getTimeRangeStringArray(this.selectedSchedule.timeInterval);
    }*/

    checkinButtonClick(){
        this.searchParam.time = this.selectedTime;
        this.router.navigate(['/schedules/checkin']);
    }
}