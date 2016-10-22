import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {METEOR_PROVIDERS} from "angular2-meteor";
import {LocalStorage} from "../services/local-storage.service";
import {UserService} from "../services/user.service";
import {ProjectService} from "../services/projects.service";
import {AppComponent} from "./app.component";
import {routing} from "./app.routes";
import {ListComponent} from "./list/list.component";
import {FormComponent} from "./form/form.component";
import {CardComponent} from "./card/card.component";
import {CommonModule} from "@angular/common";
import {ItemComponent} from "./list/item.component";
import {RatingComponent} from "./common/rating/rating.component";
import {FormsModule} from "@angular/forms";
import {InputResizeDirective} from "../directives/input-resize.directive";
import {InputToggleDirective} from "../directives/input-toggle.directive";
import {TextareaResizeDirective} from "../directives/textarea-resize.directive";
import {ProjectSearchDirective} from "../directives/project-search.directive";
import {FbCommentsComponent} from "./common/fb-comments.component";

@NgModule({
    imports: [BrowserModule, routing, CommonModule, FormsModule],
    declarations: [
        AppComponent,
        FormComponent,
        CardComponent,
        ListComponent,
        ItemComponent,

        RatingComponent,
        FbCommentsComponent,

        InputResizeDirective,
        InputToggleDirective,
        TextareaResizeDirective,
        ProjectSearchDirective
    ],
    providers: [
        ProjectService,
        UserService,
        METEOR_PROVIDERS,
        LocalStorage
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }