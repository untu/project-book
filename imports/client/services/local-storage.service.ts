export class LocalStorage {
    public localStorage: any;

    constructor() {
        if (!localStorage) {
            throw new Error('Current browser does not support Local Storage');
        }
        this.localStorage = localStorage;
    }

    public set(key: string, value: any): void {
        this.localStorage.setItem(key, JSON.stringify(value));
    }

    public get(key: string): any {
        var val = localStorage.getItem(key);

        if (val === null) return null;

        return JSON.parse(val);
    }

    public remove(key: string): any {
        this.localStorage.removeItem(key);
    }
}