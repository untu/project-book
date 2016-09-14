export var ServiceConfigurationArray = [
    [
        {service: "facebook"},
        {
            $set: {
                appId: "you_id",
                secret: "you_secret"
            }
        }
    ],
    [
        {service: "google"},
        {
            $set: {
                clientId: "you_client_id",
                secret: "you_secret"
            }
        }
    ]
];