import {Routes, RouterModule} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import {ListComponent} from "./list/list.component";
import {FormComponent} from "./form/form.component";
import {CardComponent} from "./card/card.component";

export const routes: Routes = [
    {path: '', redirectTo: '/list', pathMatch: 'full'},
    {path: 'list', component: ListComponent},
    {path: 'search/:search', component: ListComponent},
    {path: 'project/edit', component: FormComponent},
    {path: 'project/edit/:id', component: FormComponent},
    {path: 'project/:id', component: CardComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);