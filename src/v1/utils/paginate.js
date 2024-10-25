"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = void 0;
const paginate = (model_1, ...args_1) => __awaiter(void 0, [model_1, ...args_1], void 0, function* (model, page = 0, size = 10, filter = {} // Optional filter
) {
    const skip = (page - 1) * size;
    const products = yield model.findMany({
        where: filter,
        skip,
        take: size,
    });
    const totalItems = yield model.count({ where: filter });
    const totalPages = Math.ceil(totalItems / size);
    return { products, page, totalPages, totalItems };
});
exports.paginate = paginate;
