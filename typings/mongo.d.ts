declare module Mongo {
    interface Collection < T > {
        before: any;
        after: any;
        helpers(helpers?: Object);
        attachSchema(schema: SimpleSchema);
    }
}

declare class SimpleSchema {
    constructor(params: Object);
}