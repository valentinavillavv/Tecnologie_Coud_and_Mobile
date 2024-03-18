exports.handler = async (event) => {
    let response = {
        "isAuthorized": false,
    };

    if (event.headers.authorization == "OSLO") {
        response = {
            "isAuthorized": true,
        };
    }
    return response;
};
