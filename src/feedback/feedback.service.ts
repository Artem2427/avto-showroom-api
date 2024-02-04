import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFeedbackDTO } from './dto/createFeedback.dto';

import { UpdateStatusFeedbackDTO } from './dto/updateStatus.dto';
import { FeedbackEntity } from './entity/feeadback.entity';
import { IPaginationQuery } from '../../core/types/pagination.intrface';
import { PaginationQueryDTO } from '../../core/dto/pagination.query.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>,
  ) {}

  async findOneById(id: string): Promise<FeedbackEntity> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
    });

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    return feedback;
  }

  async paginateFeedbacks(paginationQuery: IPaginationQuery) {
    const { pageSize, page, searchTerm } = paginationQuery;

    const take = pageSize || 30;
    const skip = (page - 1) * take;

    const queryBuilder = this.feedbackRepository.createQueryBuilder('feedback');

    if (searchTerm) {
      queryBuilder.where(
        'feedback.phone ILIKE :name OR feedback.name ILIKE :name',
        {
          name: `%${searchTerm}%`,
        },
      );
    }

    const totalAmount = await queryBuilder.getCount();

    queryBuilder.take(take);
    queryBuilder.skip(skip);

    const feedbacks = await queryBuilder.getMany();

    return {
      feedbacks,
      total: totalAmount,
    };
  }

  async createOne(createFeedbackDto: CreateFeedbackDTO) {
    const feedback = await this.feedbackRepository.findOne({
      where: { phone: createFeedbackDto.phone },
    });

    if (feedback) {
      throw new BadRequestException('This phone is already used');
    }

    const newFeedback = new FeedbackEntity();
    Object.assign(newFeedback, createFeedbackDto);

    await this.feedbackRepository.save(newFeedback);

    return {
      success: true,
    };
  }

  async updateStatus(
    feedbackId: string,
    updateStatus: UpdateStatusFeedbackDTO,
  ) {
    const feedback = await this.findOneById(feedbackId);

    feedback.isCall = String(updateStatus.isCall) === 'true';

    await this.feedbackRepository.save(feedback);

    return {
      success: true,
    };
  }

  async removeOne(feedbackId: string) {
    const feedback = await this.findOneById(feedbackId);

    if (!feedback.isCall) {
      throw new BadRequestException('This person was not called');
    }
    await this.feedbackRepository.remove(feedback);

    return { success: true };
  }

  transformPaginationQuery(
    paginationQuery: PaginationQueryDTO,
  ): IPaginationQuery {
    return {
      page: Number(paginationQuery.page),
      pageSize: Number(paginationQuery.pageSize),
      searchTerm: paginationQuery.searchTerm
        ? paginationQuery.searchTerm.trim()
        : '',
    };
  }
}
