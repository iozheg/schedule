import { Injectable } from '@angular/core';

@Injectable()
export class SearchParamService{
    /*
        Service stores search options: carwash name, date and time for checkin.
        This helps transfer data between components: carwash-search,
        schedule-choice and time-choice.
    */

    private _carwashName: string;
    private _date: Date;
    private _time: string;
    private _selectedScheduleId: number;

    set carwashName(name: string){
        this._carwashName = name;
    }

    get carwashName(): string {
        return this._carwashName;
    }

    set date(date: Date){
        this._date = date;
    }

    get date(): Date {
        return this._date;
    }

    set time(time: string){
        this._time = time;
    }

    get time(): string {
        return this._time;
    }

    set selectedScheduleId(id: number){
        this._selectedScheduleId = id;
    }

    get selectedScheduleId(): number{
        return this._selectedScheduleId;
    }
}