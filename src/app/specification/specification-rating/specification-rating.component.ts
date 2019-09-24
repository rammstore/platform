import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-specification-rating',
  templateUrl: './specification-rating.component.html',
  styleUrls: ['./specification-rating.component.scss']
})
export class SpecificationRatingComponent implements OnInit {
  data: any = {
    title: 'Условия для попадания в рейтинг',
    items: [
      {label: 'Минимальный срок жизни стратегии, недель\t', value: '1'},
      {label: 'Минимальное количество закрытых рыночных позиций\t', value: '0'},
      {label: 'Время последней активности (открытие или закрытие рыночной позиции), не позднее', value: '365 календарных дней'},
      {label: 'Минимальная доходность', value: 'Положительная'}
    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
