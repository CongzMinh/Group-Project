import { Expose, Transform } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { IssueEntity } from './issue.entity';
import { ContractEntity } from './contract.entity';
import { PaymentEntity } from './payment.entity';

@Entity({
  name: 'rooms',
})
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: number;

  @Column()
  capacity: number;

  @Column()
  area: number;

  @Column()
  price: number;

  @Column()
  electricity: number;

  @Column()
  water: number;

  @Column()
  wifi: number;

  @Column()
  deadline: number;

  @Column()
  floor: number;

  @Column()
  available: boolean;

  @CreateDateColumn({
    name: 'created_at',
  })
  @Expose()
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  @Expose()
  updatedAt: Date;

  @Column({ default: false }) // Assuming default is not paid
  isPaid: boolean;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  @Expose()
  deletedAt?: Date;

  @OneToMany(() => UserEntity, (user) => user.room, { nullable: true })
  @Transform(({ obj }) => obj.users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
  })))
  @JoinColumn()
  users: UserEntity[];

  @OneToMany(() => IssueEntity, (issue) => issue.room)
  issues: IssueEntity[];

  @OneToMany(() => ContractEntity, (contract) => contract.room, {
    cascade: ['insert'],
  })
  @JoinColumn()
  contracts: ContractEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.room)
  payments: PaymentEntity[];
}
