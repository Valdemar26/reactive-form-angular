import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

/** @title Datepicker with custom formats */
@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class DatepickerComponent implements OnInit {

  @Output() dateChange: EventEmitter<MatDatepickerInputEvent<any>> = new EventEmitter<MatDatepickerInputEvent<any>>();

  date = new FormControl(moment());

  ngOnInit(): void {
    console.log('DATE: ', this.date);
  }

  public change(event): void {
    const customData = moment(event).format('LLLL');
    this.dateChange.emit(customData as any);
  }
}
