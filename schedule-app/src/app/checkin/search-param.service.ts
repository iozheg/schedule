import { Injectable } from '@angular/core';

import { UTCDate } from '../time';

@Injectable()
export class SearchParamService{
    /*
        Service stores search options: carwash name, date and time for checkin.
        This helps transfer data between components: carwash-search,
        schedule-choice and time-choice.
    */

    private _carwashName: string;
    private _date: UTCDate;
    private _time: UTCDate;
    private _selectedScheduleId: number;
    private _checkinId: number;

    set carwashName(name: string){
        this._carwashName = name;
    }

    get carwashName(): string {
        return this._carwashName;
    }

    set date(date: UTCDate){
        this._date = new UTCDate(date);
    }

    get date(): UTCDate {
        if(this._date === undefined){
         //   let date = new Date();
            this._date = new UTCDate();
        }
        return this._date;
    }
/*
    get dateYMD(): string {
        return this._date.getFullYear()
            + "-" + (this._date.getMonth()+1)
            + "-" + this._date.getDate();
    }
*/
    set time(time: UTCDate){
        this._time = new UTCDate(time);
    }

    get time(): UTCDate {
        return this._time;
    }

    set selectedScheduleId(id: number){
        this._selectedScheduleId = id;
    }

    get selectedScheduleId(): number{
        return this._selectedScheduleId;
    }

    set checkinId(id: number) {
        this._checkinId = id;
    }

    get checkinId(): number {
        return this._checkinId;
    }
}