import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/core/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('feedbacks')
export class FeedbackEntity extends BaseEntity {
  @ApiProperty({ type: Boolean })
  @Column({ type: 'boolean', default: false })
  isCall: boolean;

  @ApiProperty({ type: String, maxLength: 4000 })
  @Column({ type: 'varchar', length: 4000 })
  comment: string;

  @ApiProperty({ type: String, maxLength: 200 })
  @Column({ type: 'varchar', length: 200, nullable: true })
  name: string;

  @ApiProperty({ type: String, maxLength: 20 })
  @Column({ type: 'varchar', length: '20', nullable: false, unique: true })
  phone: string;
}
