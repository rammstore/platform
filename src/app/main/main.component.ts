import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    Highcharts.setOptions({
      lang: {
        months: [
          'Январь', 'Февраль', 'Март', 'Апрель',
          'Май', 'Июнь', 'Июль', 'Август',
          'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ],
        shortMonths: [
          'Янв.', 'Фев.', 'Мар.', 'Апр.',
          'Май', 'Июн.', 'Июл.', 'Авг.',
          'Сен.', 'Окт.', 'Ноя.', 'Дек.'
        ],
        weekdays: [
          'Понедельник', 'Вторник', 'Среда', 'Четверг',
          'Пятница', 'Суббота', 'Воскресенье'
        ]
      }
    });
  }

}
