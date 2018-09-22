import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { ProjectService } from './project.service';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend, BaseRequestOptions, RequestMethod } from '../../../node_modules/@angular/http';
import { MockBackend, MockConnection} from  '@angular/http/testing';
import { Project } from '../models/project';

describe('ProjectService', () => {
  let mockBackend: MockBackend;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpModule],
      providers: [ProjectService,
      MockBackend,
      BaseRequestOptions,
      {
        provide: Http,
        deps: [MockBackend, BaseRequestOptions],
        useFactory:
          (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
              return new Http(backend, defaultOptions);
          }
       }
      ]
    });

    mockBackend = getTestBed().get(MockBackend);
  });

  it('should be created', inject([ProjectService], (service: ProjectService) => {
    expect(service).toBeTruthy();
  }));

  it('should get Projects', done => {
    let projectService: ProjectService;

    getTestBed().compileComponents().then(() => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
                body: [
                  {projectId: 1, projectName: 'Project 1', priority:10},
                  {projectId: 2, projectName: 'Project 2',  priority:20},
                ]
              }
            )));
        });

        projectService = getTestBed().get(ProjectService);
        expect(projectService).toBeDefined();

        projectService.GetAllProjects().subscribe((projects: Project[]) => {
            expect(projects.length).toBeDefined();
            expect(projects.length).toEqual(2);
            expect(projects[0].projectId).toEqual(1);
            expect(projects[0].projectName).toEqual('Project 1');
            expect(projects[1].projectName).toEqual('Project 2');
            done();
        });
    });
  });

  it('should get project for the given projectId', done => {
    let projectService: ProjectService;

    getTestBed().compileComponents().then(() => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
                      body:                
                        {projectId: 2, projectName: 'Project 2', priority:20}                
                  }
            )));
        });

        projectService = getTestBed().get(ProjectService);
        expect(projectService).toBeDefined();
        projectService.GetProject(2).subscribe((project: Project) => {          
            expect(project.projectId).toEqual(2);
            expect(project.projectName).toEqual('Project 2');           
            done();
        });
    });
  });


  it('should insert new project',
    async(inject([ProjectService], (projectService) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {       
        expect(connection.request.method).toBe(RequestMethod.Post);       
        connection.mockRespond(new Response(new ResponseOptions({status: 200, 
          body:{projectId: 2, projectName: 'Project 2', priority:20}})));
      });

      let project = new Project ();
      project.priority = 20;
      project.projectName="project 2";
      projectService.AddProject(project).subscribe(
        (projectResponse: Project) => {
          expect(projectResponse).toBeDefined();
          console.log(projectResponse);           
        expect(projectResponse.projectId).toBe(2);
        expect(projectResponse.projectName).toBe('Project 2');
        });
    })));

    it('should update existing project',
    async(inject([ProjectService], (projectService) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {       
        expect(connection.request.method).toBe(RequestMethod.Put);       
        connection.mockRespond(new Response(new ResponseOptions({status: 200, 
          body:{projectId: 2, projectName: 'Project 2 updated', priority:20}})));
      });

      let project = new Project ();
      project.projectId = 2;
      project.priority = 10;
      project.projectName="Project 2 updated";
      projectService.EditProject(2, project).subscribe(
        (projectResponse: Project) => {
          expect(projectResponse).toBeDefined();
          console.log(projectResponse);
        expect(projectResponse.projectName).toBe("Project 2 updated");
        });
    })));

    it('should delete existing project',
    async(inject([ProjectService], (projectService) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {       
        expect(connection.request.method).toBe(RequestMethod.Delete);       
        connection.mockRespond(new Response(new ResponseOptions({status: 200})));
      });
      
      projectService.DeleteProject(2).subscribe(
        (successResult) => {
          expect(successResult).toBeDefined();         
        //expect(successResult.status).toBe(200);
        },
        (errorResult) => {
          throw (errorResult);
        });
    })));
});
