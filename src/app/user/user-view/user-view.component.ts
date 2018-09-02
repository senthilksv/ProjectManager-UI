import { Component, OnInit, Input} from '@angular/core';
import { User } from '../../models/user';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {

  @Input() users:User[];
  usersFiltered:User[];
  userSearch :string;
  path: string[] = ['firstName'];
  order: number = 1; // 1 asc, -1 desc;
  constructor() { }

  ngOnInit() {
   // this.usersFiltered = this.users
  }

  sortUser(prop: string) {
    this.path = prop.split('.')
    this.order = this.order * (-1); // change order
    return false; // do not reload
  }

}
