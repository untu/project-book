import {Injectable} from "@angular/core";
import {Observable, ReplaySubject} from "rxjs";
import {MeteorObservable} from "angular2-meteor/dist/index";
import {Projects, ProjectsFilter, Project} from "../../collections/projects.collection";

export * from "../../collections/projects.collection";

@Injectable()
export class ProjectService extends MeteorObservable {
    filter$ = new ReplaySubject <ProjectsFilter>(1);
    currentProject$ = new ReplaySubject <Project | null> (1);

    constructor() {
        super();
        MeteorObservable.subscribe('projects').subscribe();
    }

    search(filter: ProjectsFilter, options?): Observable<Project[]> {
        this.filter$.next(filter);

        return Projects.search(filter, options);
    }

    get(projectId: string): Observable<Project> {
        var query: Mongo.Selector = {
            _id: projectId
        };

        return Projects.find(query)
            .map((projects: Project[]) => projects[0]);
    }
}