import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Comment, CommentDocument, CommentSchema } from './schemas/comment.schema';
import { IUser } from '../users/user.interface';
import { NotFoundError } from 'rxjs';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: SoftDeleteModel<CommentDocument>) { }
  async create(createCommentDto: CreateCommentDto, user: IUser) {
    let rightValue = 0;
    if (createCommentDto.comment_parentId) {
      const parentComment = await this.commentModel.findById(createCommentDto.comment_parentId)
      if (!parentComment)
        throw new NotFoundException("Not found parent comment")
      rightValue = parentComment.comment_right

      await this.commentModel.updateMany({
        productId: createCommentDto.productId,
        comment_right: { $gte: rightValue }
      }, {
        $inc: { comment_right: 2 }
      })

      await this.commentModel.updateMany({
        productId: createCommentDto.productId,
        comment_left: { $gt: rightValue }
      }, {
        $inc: { comment_left: 2 }
      })
    }
    else {
      const maxRightValue = await this.commentModel.findOne({
        productId: createCommentDto.productId,

      }, 'comment_right', { sort: { comment_right: -1 } })

      rightValue = maxRightValue ? maxRightValue.comment_right + 1 : 1
    }

    const newComment = await this.commentModel.create({
      ...createCommentDto,
      userId: user._id,
      comment_left: rightValue,
      comment_right: rightValue + 1
    })
    return newComment
  }

  async getCommentsByParentId(
    productId: string, parentCommentId: string) {
    if (parentCommentId) {
      const parent = await this.commentModel.findById(parentCommentId)
      if (!parent)
        throw new NotFoundException("Not found parent comment")
      const comments = await this.commentModel.find({
        productId,
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lte: parent.comment_right }
      }).lean().select(
        {
          comment_left: 1,
          comment_right: 1,
          content: 1,
          parentId: 1
        }
      ).sort({ comment_left: 1 })
      return comments
    }
    const comments = await this.commentModel.find({
      productId,
    }).lean().select(
      {
        comment_left: 1,
        comment_right: 1,
        content: 1,
        parentId: 1
      }
    ).sort({ comment_left: 1 })
    return comments
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
