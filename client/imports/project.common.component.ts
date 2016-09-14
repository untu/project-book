import {Subscription} from "rxjs";

const SHORT_DESCRIPTION_LENGTH = 120;

export class ProjectCommonComponent {
    private subs: Subscription[] = [];

    protected makeDescription(desc: string, short: boolean, cut:number = SHORT_DESCRIPTION_LENGTH) {
        if (desc.length > cut && short)
            desc = desc.slice(0,  cut) + '...';

        return desc;
    };

    protected sub(sub: Subscription) {
        this.subs.push(sub);
    }

    ngOnDestroy() {
        this.subs.forEach((sub) => sub.unsubscribe());
    }
}