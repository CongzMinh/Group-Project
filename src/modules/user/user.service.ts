import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { ILike } from 'typeorm';

@Injectable()
export class UserService {
  [x: string]: any;
  constructor(private userRepo: UserRepository) {}

  createUser(createUserDto: CreateUserDto) {
    const createdUser = this.userRepo.create(createUserDto);
    return this.userRepo.save(createdUser);
  }

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: number) {
    return this.userRepo.findOne({ where: {id: id}, relations: ['room', 'contract']});
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({
      where: {
        email,
      },
    });
  }

  findByPhoneNumber(phoneNumber: string) {
    return this.userRepo.findOne({
      where: {
        phoneNumber,
      },
    });
  }

  findByStudentID(Student_ID: string) {
    return this.userRepo.findOne({
      where: {
        Student_ID,
      },
    });
  }


  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUser: UserEntity,
  ) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
  
    if (id !== currentUser.id) {
      throw new ForbiddenException('You do not have permission');
    }

    user.name = updateUserDto.name;
    user.phoneNumber = updateUserDto.phoneNumber;
    user.Student_ID = updateUserDto.Student_ID;
    user.DoB = updateUserDto.DoB;

    return this.userRepo.save(user);
  }

  
  async updatePassword(
    id: number,
    updatePasswordDto: UpdatePasswordDto,
    currentUser: UserEntity,
  ) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const isMatchPassword = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      user.password,
    );

    console.log(isMatchPassword);
    console.log(id + '============' + currentUser.id);
    if (id !== currentUser.id || !isMatchPassword) {
      throw new ForbiddenException();
    }
    const salt = await bcrypt.genSalt(+process.env.APP_BCRYPT_SALT);
    user.password = await bcrypt.hash(updatePasswordDto.newPassword, salt);
    return this.userRepo.save(user);
  }

  async searchUser(searchUserDto: SearchUserDto): Promise<UserEntity[]> {
    const { name, Student_ID } = searchUserDto;
  
    let whereCondition = {};
    if (name) {
      whereCondition['name'] = ILike(`%${name}%`);
    } else if (Student_ID) {
      whereCondition['Student_ID'] = ILike(`%${Student_ID}%`);
    }
  
    console.log('Search Criteria:', whereCondition);
  
    return this.userRepo.find({
      where: whereCondition,
      order: {
        id: 'ASC',
      },
    });
  }


}