"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommentLoader = void 0;
const dataloader_1 = __importDefault(require("dataloader"));
const Comment_1 = require("../../entities/Comment");
const createCommentLoader = () => new dataloader_1.default(async (postIds) => {
    let comments = [];
    postIds.forEach(async (postId) => {
        const comment = await Comment_1.Comment.find({ postId });
        comment.forEach((each) => {
            comments.push(each);
        });
    });
    console.log("comments", comments);
    const CommentIdsToComment = {};
    comments.forEach(c => {
        CommentIdsToComment[c.id] = c;
    });
    return postIds.map((postId) => CommentIdsToComment[postId]);
});
exports.createCommentLoader = createCommentLoader;
//# sourceMappingURL=createCommentLoader.js.map