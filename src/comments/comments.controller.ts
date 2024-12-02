import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/users/user.interface';
import { ResponseMessage } from 'src/decorators/customize';
import { CheckPolicies } from 'src/decorators/policies.decorator';
import { Action, AppAbility } from 'src/casl/casl-ability.factory';
import { Comment } from './schemas/comment.schema';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post()
  @ResponseMessage("Create new comment")

  create(@Body() createCommentDto: CreateCommentDto, @User() user: IUser) {
    return this.commentsService.create(createCommentDto, user);
  }

  @Get()
  findAll(@Body("productId") productId: string, @Body("parentCommentId") parentCommentId: string) {
    return this.commentsService.getCommentsByParentId(productId, parentCommentId);
  }

  @Delete()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, Comment),
  )
  remove(@Body('commentId') commentId: string, @Body("productId") productId: string, @User() user: IUser) {
    return this.commentsService.deleteComments(commentId, productId, user);
  }
}
