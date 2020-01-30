import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '@app/services/notifications.service';
import { DataService } from '@app/services/data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    private translateService: TranslateService,
    private notificationsService: NotificationsService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.getAccountSpecAsset();
    this.setHighChartsLocale();

    this.translateService.use(localStorage.getItem('language'));

    this.translateService.onDefaultLangChange.subscribe(() => {
      this.setHighChartsLocale();
    });
  }

  setHighChartsLocale(): void {
    let months: string[] = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    let shortMonths: string[] = ['Янв.', 'Фев.', 'Мар.', 'Апр.', 'Май', 'Июн.', 'Июл.', 'Авг.', 'Сен.', 'Окт.', 'Ноя.', 'Дек.'];
    let weekdays: string[] = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

    if (this.translateService.defaultLang === 'en') {
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      shortMonths = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
      weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    }

    Highcharts.setOptions({
      lang: {
        months: months,
        shortMonths: shortMonths,
        weekdays: weekdays
      }
    });
  }
}
