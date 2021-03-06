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
exports.RegisterController = void 0;
var database_1 = require("../database");
var yup = __importStar(require("yup"));
var bcrypt_1 = require("bcrypt");
var AppError_1 = require("../errors/AppError");
var errorMessages_1 = __importDefault(require("../const/errorMessages"));
var sucessMessages_1 = __importDefault(require("../const/sucessMessages"));
var RegisterController = /** @class */ (function () {
    function RegisterController() {
    }
    RegisterController.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, nickname, password, schema, err_1, saltRounds, userData, db, collection, nicknameAlreadyExists;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = req.body, email = _a.email, nickname = _a.nickname, password = _a.password;
                        schema = yup.object().shape({
                            email: yup.string().email().required(),
                            nickname: yup.string().required(),
                            password: yup.string().required(),
                        });
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, schema.validate(req.body, { abortEarly: false })];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _c.sent();
                        throw new AppError_1.AppError(err_1);
                    case 4:
                        saltRounds = 10;
                        _b = {
                            email: email,
                            nickname: nickname
                        };
                        return [4 /*yield*/, bcrypt_1.hash(password, saltRounds)];
                    case 5:
                        userData = (_b.password = _c.sent(),
                            _b.createdAt = new Date(),
                            _b);
                        return [4 /*yield*/, database_1.connectionToDatabase(process.env.MONGODB_URI)];
                    case 6:
                        db = _c.sent();
                        collection = db.collection('users');
                        return [4 /*yield*/, collection.findOne({
                                email: userData.email,
                            })];
                    case 7:
                        nicknameAlreadyExists = _c.sent();
                        if (nicknameAlreadyExists) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ message: errorMessages_1.default.EMAIL_ALREADY_EXISTS })];
                        }
                        return [4 /*yield*/, collection.insertOne(userData)];
                    case 8:
                        _c.sent();
                        return [2 /*return*/, res.status(201).json({
                                message: sucessMessages_1.default.USER_CREATED,
                                userData: userData,
                            })];
                }
            });
        });
    };
    return RegisterController;
}());
exports.RegisterController = RegisterController;
