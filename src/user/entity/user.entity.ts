import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/core/entities/base.entity';
import { UserRolesEnum } from 'src/core/enums/userRole.enum';
import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: '200', nullable: false })
  firstName: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: '200', nullable: false })
  lastName: string;

  @ApiProperty({ type: String, writeOnly: true })
  @Column({ type: 'varchar', length: '2000', nullable: false, select: false })
  password: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: '200', nullable: false, unique: true })
  email: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: '20', nullable: true })
  phone: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: '2000', nullable: true })
  avatar: string;

  @ApiProperty({ enum: UserRolesEnum, isArray: false })
  @Column({
    type: 'enum',
    enum: UserRolesEnum,
    default: UserRolesEnum.Guest,
  })
  role: UserRolesEnum;

  @BeforeInsert()
  async hashPassord() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
