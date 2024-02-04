import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { Roles } from '../user/decorator/role.decorator';
import { RoleGuard } from '../user/guards/role.guard';
import { CreateFeedbackDTO } from './dto/createFeedback.dto';

import { UpdateStatusFeedbackDTO } from './dto/updateStatus.dto';
import { FeedbackService } from './feedback.service';
import { PaginationQueryDTO } from '../../core/dto/pagination.query.dto';
import { UserRolesEnum } from '../../core/enums/userRole.enum';

@ApiTags('Feedback flow')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get feedbacks by paginate' })
  @Get('paginate')
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  async paginateFeedbacks(@Query() paginationQuery: PaginationQueryDTO) {
    return await this.feedbackService.paginateFeedbacks({
      ...paginationQuery,
      searchTerm: paginationQuery.searchTerm
        ? paginationQuery.searchTerm.trim()
        : '',
    });
  }

  @ApiOperation({ summary: 'Create one' })
  @Post('')
  async createOne(@Body() createFeedbackDto: CreateFeedbackDTO) {
    return await this.feedbackService.createOne(createFeedbackDto);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Change status' })
  @Patch(':feedbackId')
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async updateStatus(
    @Param('feedbackId', IdValidationPipe) feedbackId: string,
    @Query() updateStatus: UpdateStatusFeedbackDTO,
  ) {
    return await this.feedbackService.updateStatus(feedbackId, updateStatus);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Clear one' })
  @Delete(':feedbackId')
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async deleteOne(@Param('feedbackId', IdValidationPipe) feedbackId: string) {
    return await this.feedbackService.removeOne(feedbackId);
  }
}
