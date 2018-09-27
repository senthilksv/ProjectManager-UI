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

describe('TaskmgrAddComponent', () => {
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

    const USERS : any[] = [
      { "userId": 1, "firstName": "User 1","lastName": "","employeeId" : 10  },
      { "userId": 2, "firstName": "User 2","lastName": "","employeeId" : 20  }
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

  it('onAddTask should show validation alert', () =>
  {
    component.isParentTaskSelected = false;      
    var startDate = new Date();
    startDate.setDate(new Date().getDate() + 1);  
    component.taskDetail.startDate =  startDate;
    component.taskDetail.endDate = new Date();    
    spyOn(window,'alert').and.stub();

    var result = component.onAddTask();

    expect(result).toBe(false);
    expect(window.alert).toHaveBeenCalledWith("End Date should not be prior/equal to start date");
  });

 

  it('Add should return Success', () =>
  {
    component.isParentTaskSelected = true;   
    spyOn(taskService,'AddTask').and.returnValue(Observable.of("1"));    
    spyOn(component,"openModal").and.stub();

    component.onAddTask();
   
    expect(component.results.length).toBeGreaterThan(0);
    expect(component.openModal).toHaveBeenCalled();         
  });

  it('Add should return Bad Request', () =>
  {
    component.isParentTaskSelected = true;        
    spyOn(component,"openModal").and.stub();
    var error = { status: 400, _body :'"Bad Request"'};   
    spyOn(taskService,'AddTask').and.returnValue(Observable.throw(error));

    component.onAddTask();    
    
    expect(component.results).toBe("Bad Request");
    expect(component.openModal).toHaveBeenCalled();          
  });

  it('Resetting Task Detail', () =>
  {
    var taskDetail = new TaskDetail() ;   
    component.taskDetail = taskDetail;    
    taskDetail.name ="task 1";
    taskDetail.id = 1;
    taskDetail.priority =10;
    
    component.onResetTask();   

    expect(component.taskDetail.priority).toBe(0);
    expect(component.taskDetail.id).toBeUndefined();
    expect(component.taskDetail.name).toBeUndefined();  
    expect(component.parentTaskName).toBe(""); 
    expect(component.managerName).toBe(""); 
    expect(component.projectName).toBe(""); 
  })

  it('should return false when task details are invalid for submit', () =>
  {
    var taskDetail = new TaskDetail();
    component.taskDetail = taskDetail;
    var result = component.onValidate();
    expect(result).toBe(true);

    taskDetail.name = "task 1";
    console.log(component.taskDetail.name);
    var result = component.onValidate();
    expect(result).toBe(true);

    taskDetail.userDetail = new User();
    var result = component.onValidate();
    expect(result).toBe(true);
    taskDetail.startDate =  new Date();
    
    taskDetail.projectDetail = new Project();
    
    var endDate = new Date();
    endDate.setDate(new Date().getDate() + 1);  
    taskDetail.startDate =  new Date();
    taskDetail.endDate = endDate;
    var result = component.onValidate();
   
    expect(result).toBe(true);

    taskDetail.priority = 1
    var result = component.onValidate();
    expect(result).toBe(true);

    taskDetail.parentId = 1
    var result = component.onValidate();
    expect(result).toBe(false);
  });

  it('onSelectProject should set projectName', () =>
  {
    var project= new Project();
    component.taskDetail = new TaskDetail();
    project.projectId =1001;
    project.projectName ="project 1";

    component.onSelectProject(project);

    expect(component.taskDetail.projectId).toBe(1001);
    expect(component.projectName).toBe("project 1");
  });

  it('onSearchManager should have been called onGetAllUsers', () =>
  {
    spyOn(component,"onGetAllUsers").and.stub();
    component.onSearchManager();

    expect(component.onGetAllUsers).toHaveBeenCalled();
  });

  it('onSelectManager should set managername', () =>
  {
    var user= new User();
    component.taskDetail = new TaskDetail();
   
    user.userId =1001;
    user.firstName ="first";
    user.lastName ="last";

    component.onSelectManager(user);

    expect(component.taskDetail.userId).toBe(1001);
    expect(component.managerName).toBe("first last");
  });

  it('onSearchParent should have been called onGetAllParentTask', () =>
  {
    spyOn(component,"onGetAllParentTask").and.stub();
    component.onSearchParent();

    expect(component.onGetAllParentTask).toHaveBeenCalled();
  });

  it('onSelectParentTask should set parentTaskName', () =>
  {
    var parentTaskDetail= new TaskDetail();
    parentTaskDetail.id = 1001;
    parentTaskDetail.name = "parent task";
    component.taskDetail = new TaskDetail();

    component.onSelectParentTask(parentTaskDetail);

    expect(component.taskDetail.parentId).toBe(1001);
    expect(component.parentTaskName).toBe("parent task");
  });

  it('Should return users', () =>
  {
    spyOn(userService,'GetAllUsers').and.returnValues(Observable.of(USERS));

    component.onSearchManager();    

    expect(component.users.length).toBe(2);   
    expect(userService.GetAllUsers).toHaveBeenCalled();
  });

  it('Should return active tasks 1', () =>
  {
    spyOn(taskService,'GetParentList').and.returnValues(Observable.of(TASK_DETAILS));
    
    component.onGetAllParentTask();    

    expect(component.parentTaskDetails.length).toBe(1);   
    expect(taskService.GetParentList).toHaveBeenCalled();
  });

  it('onAddTaskNavigateToView modal should go to view', () =>
  {
    component.onAddTaskNavigateToView();     

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/viewTask']);
  })

});

