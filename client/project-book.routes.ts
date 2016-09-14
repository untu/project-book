import {Routes, RouterModule} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import {ProjectListComponent} from "./components/list/project.list.component";
import {ProjectFormComponent} from "./components/form/project.form.component";
import {ProjectCardComponent} from "./components/card/project.card.component";

export const routes: Routes = [
    {path: '', redirectTo: '/list', pathMatch: 'full'},
    {path: 'list', component: ProjectListComponent},
    {path: 'search/:search', component: ProjectListComponent},
    {path: 'project/edit', component: ProjectFormComponent},
    {path: 'project/edit/:id', component: ProjectFormComponent},
    {path: 'project/:id', component: ProjectCardComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);