import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user/user.service';
import { Observable } from 'rxjs/index';
import { User } from '../shared/user/user';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {
  user: Observable<User>;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.user = this.userService.getUser();
  }

}
