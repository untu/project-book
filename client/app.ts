import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {MeteorModule} from "angular2-meteor";
import {LOCAL_STORAGE_PROVIDERS} from "./directives/local-storage";
import {UserService} from "./services/user.service";
import {ProjectService} from "./services/projects.service";
import {ProjectComponent} from "./components/main.component";
import {routing} from "./project-book.routes";
import {ProjectListComponent} from "./components/list/project.list.component";
import {ProjectFormComponent} from "./components/form/project.form.component";
import {ProjectCardComponent} from "./components/card/project.card.component";

@NgModule({
    imports: [BrowserModule, MeteorModule, routing],
    declarations: [ProjectComponent, ProjectListComponent, ProjectFormComponent, ProjectCardComponent],
    providers: [
        LOCAL_STORAGE_PROVIDERS,
        ProjectService,
        UserService
    ],
    bootstrap: [ProjectComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
