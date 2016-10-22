import {Component, Input} from '@angular/core';
import {Project} from "../../../../collections/projects.collection";
import {User} from "../../../../collections/users.collection";

@Component({
    selector: 'rating',
    template: `
        <template ngFor let-i [ngForOf]="[5,4,3,2,1]">
            <label class="star-rating__ico fa fa-star fa-lg" 
                [class.fa-star-o]="i > project.rating.average"
                [class.my-choice]="isMyChoice(i)"
                [class.active]="active"
                (click)="rate(i)"
            ></label>           
        </template>       
    `
})
export class RatingComponent {
    @Input() project: Project;
    @Input() active: boolean = false;
    @Input() userId?: string;

    rate(vote: number){
        if (!(this.userId && this.active)){
            return false;
        }

        this.project.rate(vote, this.userId);
    }

    isMyChoice(index: number) {
        if (!this.userId)
            return false;

        return index == this.project.rating.list[this.userId]
    }
}