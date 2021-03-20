"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMailController = void 0;
var yup = __importStar(require("yup"));
var path_1 = require("path");
var crypto_1 = require("crypto");
var database_1 = require("../database");
var AppError_1 = require("../errors/AppError");
var sendMailService_1 = __importDefault(require("../services/sendMailService"));
var SendMailController = /** @class */ (function () {
    function SendMailController() {
    }
    SendMailController.prototype.execute = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var email, schema, db, collection, user, npsPath, token, now, variables, infoMessageSend;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = request.body.email;
                        schema = yup.object().shape({
                            email: yup.string().email().required(),
                        });
                        try {
                            schema.validate(request.body);
                        }
                        catch (err) {
                            throw new AppError_1.AppError(err);
                        }
                        return [4 /*yield*/, database_1.connectionToDatabase(process.env.MONGODB_URI)];
                    case 1:
                        db = _a.sent();
                        collection = db.collection('users');
                        return [4 /*yield*/, collection.findOne({ email: email })];
                    case 2:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, response.status(400).json({ message: 'Email not exists!' })];
                        npsPath = path_1.resolve(__dirname, '..', 'views', 'emails', 'templateMailForgotPassword.hbs');
                        token = crypto_1.randomBytes(20).toString('hex');
                        now = new Date();
                        now.setHours(now.getHours() + 3);
                        return [4 /*yield*/, collection.findOneAndUpdate({ _id: user._id }, {
                                $set: {
                                    passwordResetToken: token,
                                    passwordResetExpires: now,
                                },
                            })];
                    case 3:
                        _a.sent();
                        variables = {
                            token: token,
                            link: process.env.URL_RESET_PASSWORD,
                        };
                        return [4 /*yield*/, sendMailService_1.default.execute(email, 'Noreply', variables, npsPath)];
                    case 4:
                        infoMessageSend = _a.sent();
                        if (!infoMessageSend)
                            return [2 /*return*/, response
                                    .status(400)
                                    .json({ message: 'It was not possible to send the email' })];
                        return [2 /*return*/, response.json({ message: 'Email enviado com sucesso!' })];
                }
            });
        });
    };
    return SendMailController;
}());
exports.SendMailController = SendMailController;