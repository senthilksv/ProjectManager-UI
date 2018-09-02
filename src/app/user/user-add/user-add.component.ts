import { Component, OnInit} from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../SharedService/user.service';
import { Router} from '@angular/router';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit { 
  public user:User;
  public updatedUsers:User[];
  results:string
  constructor(private service:UserService,private router: Router) { 
    this.user = new User();
  }

  ngOnInit() {
    this.onGetAllUsers();
  }

  onAddUser()
    {     
      this.service.AddUser(this.user).subscribe(response => 
        {
          this.results = response;
          console.log("result text:" + this.results);  
          this.user = new User();     
          this.onGetAllUsers()
         // this.openModal();
        },
        error =>
        {
          console.log(error.status);
          console.log(error.statusText);
          console.log(error._body);
          console.log(JSON.parse(error._body));
          if(error.status < 200 || error.status > 300)
            this.results = JSON.parse(error._body);
          //  this.openModal();
        }
      );
    }

    onGetAllUsers()
    {
      this.service.GetAllUsers().subscribe(
        u=>this.updatedUsers=u);
    }

    onResetUser()
    {
      this.user = new User();     
    }   
}
