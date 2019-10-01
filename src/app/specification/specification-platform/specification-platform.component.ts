import { Component } from '@angular/core';

@Component({
  selector: 'app-specification-platform',
  templateUrl: './specification-platform.component.html',
  styleUrls: ['./specification-platform.component.scss']
})
export class SpecificationPlatformComponent {
  datas: any[] = [{
    title: 'Счет',
    items: [
      {label: 'Доступные валюты счета', value: 'USD'},
      {label: 'Минимальный депозит', value: '200,00 USD'}
    ]
  }, {
    title: 'Инвестиции',
    items: [
      {label: 'Минимальный баланс', value: '200,00 USD'}
    ]
  }, {
    title: 'Стратегии',
    items: [
      {label: 'Минимальная сумма для создания', value: '200,00 USD'},
      {label: 'Вознаграждение', value: '0 - 50% от прибыли'}
    ]
  }, {
    title: 'Торговый интервал',
    items: [
      {label: 'Начало', value: 'вторник 18:09'},
      {label: 'Конец', value: 'вторник 18:09'}
    ]
  }];
}
