import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map'
import { TaskDetail } from '../models/task-detail';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
const TASK_DETAILS : any[] = [
    { "id": 101, "name": "Task 101", "startDate": "2018-07-23","endDate" :"2018-07-28", "priority":10,
    "activeStatus":true, "parentId":2, "parentName":"parent" },
    ];

  const TASK_DETAIL : TaskDetail = new TaskDetail();
export class MockTaskService {
    public GetAllTasks(): Observable<TaskDetail[]> {
        return Observable.of(TASK_DETAILS);
      }

      public GetTask(): Observable<TaskDetail> {
        return Observable.of(TASK_DETAIL);
      }

      public AddTask(Item:TaskDetail): Observable<string> {
        return Observable.of("Success");
      }

      public PutTask(Item:TaskDetail, Id:number): Observable<string> {
        return Observable.of("Success");
      }
}
