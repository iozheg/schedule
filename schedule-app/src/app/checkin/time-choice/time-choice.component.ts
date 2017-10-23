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
    selectedTime: UTCDate;
    checkinId: number;

    checkinButtonActive = false;

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

            // If return from finish-checkin component than we should
            // cancel booking that was made earlier
            if(this.searchParam.checkinId > 0)
                this.unbookTime(this.searchParam.checkinId);

            this.scheduleId = this.searchParam.selectedScheduleId;
            this.selectedDate = this.searchParam.date

            this.scheduleService.getScheduleDetailInfo(this.scheduleId)
                .then( schedule => {
                    this.selectedSchedule = schedule;
                    this.selectedSchedule.createTimeArray(this.selectedDate);
                    this.timeArray = this.selectedSchedule.timeRange.dateRange;
                //    console.log(this.selectedDate);
                //    console.log(this.selectedDate.toISOString());
                })
                .then(() => this.scheduleService.getOccupiedTime(this.scheduleId, this.selectedDate.toISOString())
                    .then(list => this.selectedSchedule.markOccupiedTime(list))   
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

    bookTime(){

        if(this.checkinId > 0){
            this.unbookTime(this.checkinId);
            this.checkinId = 0;
        }

        this.searchParam.date.setTime(new UTCDate(this.selectedTime).getTimeString());
        this.scheduleService.bookTime(
            this.searchParam.selectedScheduleId, 
            this.searchParam.date.toISOString()
        )
        .then( checkinId => {
                checkinId ? this.checkinButtonActive = true : false;
                this.checkinId = +checkinId;
            }
        );
    }

    unbookTime(id: number){
        this.scheduleService.cancelBookingTime(id);
    }

    checkinButtonClick(){
    //    this.searchParam.time = this.selectedTime;
    //    console.log(this.selectedTime);
    //    console.log(this.searchParam.time);
    //    this.searchParam.date.setTime(new UTCDate(this.selectedTime).getTimeString());
    //    console.log(this.searchParam.time);
    /*    this.searchParam.carwashName = this.selectedSchedule.name;
        this.scheduleService.confirmCheckin(this.checkinId).
        then(result => {
            if (result === 'success')
                this.router.navigate(['/schedules/checkin']);
        });*/
        this.searchParam.checkinId = this.checkinId;
        this.router.navigate(['/schedules/checkin']);
    }
}