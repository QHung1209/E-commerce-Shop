import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Comment, CommentDocument, CommentSchema } from './schemas/comment.schema';
import { IUser } from '../users/user.interface';
import { NotFoundError } from 'rxjs';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: SoftDeleteModel<CommentDocument>
    , private productService: ProductsService) { }
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

  async deleteComments(commentId: string, productId: string, user: IUser) {
    const existsProduct = await this.productService.findProductById(productId)

    if (!existsProduct)
      throw new NotFoundException("Not found product id")

    const existsComment = await this.commentModel.findById(commentId)

    if (!existsComment)
      throw new NotFoundException("Not found comment id")

    const leftValue = existsComment.comment_left
    const rightValue = existsComment.comment_right

    const width = rightValue - leftValue + 1

    await this.commentModel.softDelete({
      productId,
      comment_left: { $gte: leftValue, $lte: rightValue },
    })

    await this.commentModel.updateMany({
      productId,
      comment_left: { $gte: leftValue, $lte: rightValue },
    }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })

    await this.commentModel.updateMany({
      productId,
      comment_right: { $gt: rightValue }
    }, {
      $inc: { comment_right: -width },
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    })

    await this.commentModel.updateMany({
      productId,
      comment_left: { $gt: rightValue }
    }, {
      $inc: { comment_left: -width },
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    })

    return true
  }
}
