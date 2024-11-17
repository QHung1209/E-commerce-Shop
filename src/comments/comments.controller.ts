import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/users/user.interface';
import { ResponseMessage } from 'src/decorators/customize';

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
  remove(@Body('commentId') commentId: string, @Body("productId") productId: string, @User() user: IUser) {
    return this.commentsService.deleteComments(commentId, productId, user);
  }
}
