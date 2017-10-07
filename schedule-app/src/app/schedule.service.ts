import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ScheduleService {
    constructor(
        private httpClient: HttpClient
    ) { }
    
    getSchedules(): void{
        this.httpClient.get('/api/schedules')
            .subscribe(data => {console.log(data);});
    }

    searchSchedulesByName(term: string): Observable<string[]>{
        return this.httpClient
            .get('api/schedules/?name=' + term)
            .map(response => response['schedules'] as string[]);
    }
}