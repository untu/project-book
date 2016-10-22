import {Injectable} from "@angular/core";
import {ReplaySubject, Observable} from "rxjs";
import * as _ from 'lodash';
import {Projects, ProjectsFilter, Project} from "../../collections/projects.collection";
import {MeteorObservable, ObservableCursor} from "meteor-rxjs";

export * from "../../collections/projects.collection";

@Injectable()
export class ProjectService {
    filter$ = new ReplaySubject <ProjectsFilter>(1);
    private _currentProject$ = new ReplaySubject <Project | null> (1);

    constructor() {
        MeteorObservable.subscribe('projects').subscribe(()=>{
            Projects.find().count().subscribe(x=>console.log('count ',x))
        });
    }

    search(filter: ProjectsFilter, options?): ObservableCursor<Project> {
        this.filter$.next(filter);

        return Projects.search(filter, options)
    }

    get currentProject$() {
        return this._currentProject$.asObservable();
    }

    set currentProject(project: Project | null) {
        this._currentProject$.next(project);
    }

    getById(projectId: string): Observable<Project> {
        let query: Mongo.Selector = {
            _id: projectId
        };

        let projects$ = Projects.find(query);

        return projects$.map(_.first);
    }
}