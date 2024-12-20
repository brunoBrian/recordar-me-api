"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const admin = require("firebase-admin");
const uuid_1 = require("uuid");
let StorageService = class StorageService {
    constructor() {
        this.storage = admin.storage();
    }
    async uploadFile(file) {
        const fileName = `${(0, uuid_1.v4)()}-${file.originalname}`;
        const bucket = this.storage.bucket();
        const fileBuffer = file.buffer;
        const fileRef = bucket.file(fileName);
        await fileRef.save(fileBuffer, {
            metadata: {
                contentType: file.mimetype,
            },
        });
        await fileRef.makePublic();
        return fileRef.publicUrl();
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StorageService);
//# sourceMappingURL=storage.service.js.map