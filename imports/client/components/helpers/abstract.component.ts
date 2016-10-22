import {Subscription} from "rxjs";
import {MeteorReactive} from "angular2-meteor"

const SHORT_DESCRIPTION_LENGTH = 120;

export class AbstractComponent {
    private _subs: Subscription[] = [];

    protected makeDescription(desc: string, short: boolean, cut:number = SHORT_DESCRIPTION_LENGTH) {
        if (desc.length > cut && short)
            desc = desc.slice(0,  cut) + '...';

        return desc;
    };

    protected sub(sub: Subscription) {
        this._subs.push(sub);
    }

    ngOnDestroy() {
        this._subs.forEach((sub) => sub.unsubscribe());
        this._subs = [];
    }
}