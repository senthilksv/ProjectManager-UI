import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { User } from '../../models/user';
import 'rxjs/add/operator/catch';
import { UserService } from '../../SharedService/user.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {

  @Input() users:User[];
  usersFiltered:User[];
  userSearch :string;
  results:string
  path: string[] = ['firstName'];
  order: number = 1; // 1 asc, -1 desc;
  @Output() userSelectionChanged = new EventEmitter();
  constructor(private service:UserService) { }

  ngOnInit() {
   // this.usersFiltered = this.users
  }

  sortUser(prop: string) {
    this.path = prop.split('.')
    this.order = this.order * (-1); // change order
    return false; // do not reload
  }

  onSelectUser(userId:number)
  {
    this.userSelectionChanged.emit(userId);
    return false;
  }

  onDeleteUser(userId:number)
  {   
    if(window.confirm('Are sure you want to delete this user ?')){
      this.service.DeleteUser(userId).subscribe(response => 
        {
          this.results = "User has been deleted successfully for the user id " + response;
          console.log("result text:" + this.results); 
          window.alert(this.results);
          this.onGetAllUsers();
        },
        error =>
        {         
          if(error.status < 200 || error.status > 300)
            this.results = JSON.parse(error._body);      
            window.alert(this.results);     
        })

      return false;    
     }
    return false;
  }

  onGetAllUsers()
  {
    this.service.GetAllUsers().subscribe(
      u=>this.users=u);
  }

}
