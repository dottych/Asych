class Utils {
    constructor() {}

    log(message) {
        let time = new Date().toUTCString();
        console.log(`[${time}] ${message}`);
    }

    decrypt(string) {
        // maybe convert them to for loops
        let i = 0;
        let indexTest = null;
        let decrypted = "";
        let decryptBits = [];
        i = 0;
        while (i < string.length) {
            indexTest = string.substr(i, 1);
            if (isNaN(Number(indexTest))) {
                decrypted += ".";
            } else {
                decrypted += indexTest;
            }
            i++;
        }
    
        decryptBits = decrypted.split(".");
        decrypted = "";
        i = decryptBits.length - 2;
        while (i >= 0) {
            decrypted += String.fromCharCode(decryptBits[i] - decryptBits[decryptBits.length - 1] / 3);
            i--;
        }
    
        return decrypted;
    }

    splitRequest(body) {
        const params = {};

        const split = body.replaceAll('&&', '&').split('&');

        for (let param of split) {
            const splitParam = param.split('=');
            params[splitParam[0]] = splitParam[1];
        }

        delete params[""];

        return params;
    }

    response(responseObject) {
        let joinedParams = "";

        for (let param of Object.entries(responseObject)) {
            joinedParams += param[0];
            joinedParams += '=';
            joinedParams += param[1];
            joinedParams += '&';
        }

        // this gets rid of the last ampersand
        return joinedParams.substring(0, joinedParams.length-1);
    }

    parseKv(kv) {
        const split = kv.split('=');
        return { key: split[0], value: split[1] }
    }

    constructKv(kv) {
        return `${kv.key}=${kv.value}`;
    }
}

module.exports = new Utils();