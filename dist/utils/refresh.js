"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
function refresh(token) {
    var payload = jsonwebtoken_1.verify(token, this.secretOrPublicKey);
    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;
    delete payload.jti; //We are generating a new token, if you are using jwtid during signing, pass it in refreshOptions
    // The first signing converted all needed options into claims, they are already in the payload
    return jsonwebtoken_1.sign(payload, this.secretOrPrivateKey);
}
exports.refresh = refresh;
