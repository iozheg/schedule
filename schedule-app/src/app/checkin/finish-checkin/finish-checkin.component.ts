import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SearchParamService } from '../search-param.service';
import { UTCDate } from '../../time';
import { Schedule } from '../schedule';
import { ScheduleService } from '../../schedule.service';

@Component({
    templateUrl: 'finish-checkin.component.html',
    styleUrls: ['finish-checkin.component.css']
})

export class FinishCheckinComponent implements OnInit {

    carwashName: string;
    selectedDate: UTCDate;
    selectedTime: UTCDate;    
    selectedScheduleId: number;

    isDone: boolean = false;
//    clientName: string;
    clientTelNumber: string = '';
    clientCarRegplate: string;
    clientCarModel: string;

    constructor(
        private searchParam: SearchParamService,
        private router: Router,
        private scheduleService: ScheduleService
    ) { }

    ngOnInit() { 
        if(this.searchParam.selectedScheduleId === undefined)
            this.router.navigate(['/schedules']);
    
        else{
            this.selectedScheduleId = this.searchParam.selectedScheduleId;
            this.carwashName = this.searchParam.carwashName;
            this.selectedDate = this.searchParam.date;
            this.selectedTime = this.searchParam.time;
        }
    }

    doneButtonClick(){
        this.scheduleService.confirmCheckin(
                                this.searchParam.checkinId,
                                this.clientTelNumber,
                                this.clientCarRegplate,
                                this.clientCarModel
                            )
            .then(result => {
                if (result == 'success')
                    this.isDone = true;
                else
                    return; // ADD ERROR HANDLING HERE
            });
    }
}