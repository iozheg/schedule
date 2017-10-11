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
        this._date = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        );
    }

    get date(): Date {
        if(this._date === undefined){
            let date = new Date();
            this._date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        }
        return this._date;
    }

    get dateYMD(): string {
        return this._date.getFullYear()
            + "-" + (this._date.getMonth()+1)
            + "-" + this._date.getDate();
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