import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskmgrAddComponent } from './taskmgr-add.component';
import { ProjectService } from '../../SharedService/project.service';
import { MockProjectService } from '../../SharedService/mock-project-service';
import { UserService } from '../../SharedService/user.service';
import { MockUserService } from '../../SharedService/mock-user-service';
import { TaskService } from '../../SharedService/task.service';
import { MockTaskService } from '../../SharedService/mock-task-service';
import { Observable } from '../../../../node_modules/rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { FormsModule }   from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskDetail } from '../../models/task-detail';
import { Project } from '../../models/project';
import { User } from '../../models/user';
import { Router,ActivatedRoute} from '@angular/router';
import { ProjectNameSearchPipe } from '../../pipes/project-name-search.pipe'
import { UsersSearchPipe } from '../../pipes/users-search.pipe'

fdescribe('TaskmgrAddComponent', () => {
  let component: TaskmgrAddComponent;
  let fixture: ComponentFixture<TaskmgrAddComponent>;
  let userService : UserService; 
  let taskService : TaskService; 
  let projectService : ProjectService; 

  const USER : any =   { "userId": 1, "firstName": "User 1","lastName": "","employeeId" : 10  };
  const PROJECT : any =   { "projectId": 1, "projectName": "Project 1",
  "startDate": "2018-07-23","endDate" :"2018-07-28", "priority":10, "userId" : 1, "activeStatus" : true,
   "userDetail" : USER };
 

  const TASK_DETAILS : any[] = [{ "id": 1, "name": "Task 1", "startDate": Date.now, 
  "endDate" :Date.now, "priority":10, 
      "activeStatus":true, "parentId":2, "parentName":"parent", "userDetail" : USER,"projectDetail" : PROJECT },
      { "id": 2, "name": "Task 2", "startDate": Date.now, "endDate" :Date.now, "priority":10, 
      "activeStatus":false, "parentId":2, "parentName":"parent","userDetail" : USER,"projectDetail" : PROJECT }
    ];    

    const PROJECTS : any[] = [
      { "projectId": 1, "projectName": "Project 1",
      "startDate": "2018-07-23","endDate" :"2018-07-28", "priority":10, "userId" : 1, "activeStatus" : true
       },
      { "projectId": 2, "projectName": "Project 2",
      "startDate": "2018-07-23","endDate" :"2018-07-28", "priority":20, "userId" : 1, "activeStatus" : true
        }
    ];

    let mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule],
      declarations: [ TaskmgrAddComponent,ProjectNameSearchPipe,UsersSearchPipe ] , 
      providers: [
        {provide: TaskService, useClass: MockTaskService},
        {provide: UserService, useClass: MockUserService},
        {provide: ProjectService, useClass: MockProjectService},
        { provide: Router, useValue: mockRouter}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskmgrAddComponent);
    component = fixture.componentInstance;
    taskService = TestBed.get(TaskService);
    projectService = TestBed.get(ProjectService);
    userService = TestBed.get(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default task details', () =>
  {   
    component.ngOnInit();
    expect(component.taskDetail.priority).toBe(0);
    expect(component.taskDetail.activeStatus).toBe(true);
  });

  it('onSearchProject should have been called onGetAllProjects', () =>
  {
    component.taskDetail = new TaskDetail();
    spyOn(component,'onGetAllProjects').and.stub();
    component.onSearchProject();   
    expect(component.onGetAllProjects).toHaveBeenCalled();    
  });

  it('onGetAllProjects should have been called GetAllProjects', () =>
  {
    component.taskDetail = new TaskDetail();
    spyOn(projectService,'GetAllProjects').and.returnValue(Observable.of(PROJECTS))
    component.onGetAllProjects();   
    expect(projectService.GetAllProjects).toHaveBeenCalled();    
    expect(component.projects.length).toBe(2);
  });

});
