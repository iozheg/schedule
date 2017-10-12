import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Schedule } from './checkin/schedule';
import { UTCDate } from './time';

@Injectable()
export class ScheduleService {

    private response: Schedule[];

    constructor(
        private httpClient: HttpClient
    ) { }
    
    getSchedules(): void{
        this.httpClient.get('/api/schedules')
            .subscribe(data => {console.log(data);});
    }

    getNamesOfSchedules(term: string): Observable<string[]>{
        return this.httpClient
            .get('api/search/?name=' + term)
            .map(response => response['schedules'] as string[]);
    }

    getSchedulesBriefInfo(name: string): Promise<Schedule[]> {
        return this.httpClient
            .get('api/schedules/?name=' + name)
            .toPromise()
            .then(response => 
                response['schedules'].map(
                    element => new Schedule(element)
                )
            );
    }

    getScheduleDetailInfo(id: number): Promise<Schedule> {
        return this.httpClient
            .get('api/schedule/' + id)
            .toPromise()
            .then(response => new Schedule(response['schedule']));
    }

    getAvailableTimeForCheckin(scheduleId: number, date: string): Promise<string[]>{
        return this.httpClient
            .get('api/schedule/' + scheduleId + '/available?date=' + date)
            .toPromise()
            .then( response => response['time']);
    }

    getOccupiedTime(schedule_id: number, date: string): Promise<UTCDate[]>{
        return this.httpClient
            .get('api/schedule/' + schedule_id + '/occupied?date=' + date)
            .toPromise()
            .then(response => 
                response['time_list'].map(
                    elem => new UTCDate(elem)
            ));
    }
}