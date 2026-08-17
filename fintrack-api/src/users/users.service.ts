import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
import { assertOwnerOrAdmin } from 'src/common/authorization/assert-owner';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  getAllUsers() {
    return this.userRepository.getAllUsers();
  }

  async getUserById(id: number, currentUser: CurrentUserPayload) {
    assertOwnerOrAdmin(currentUser, id);
    return this.userRepository.getUserById(id);
  }

  async createUser(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);
    return this.userRepository.createUser({
      ...dto,
      password: hashedPassword,
    });
  }

  async updateUser(
    id: number,
    dto: UpdateUserDto,
    currentUser: CurrentUserPayload,
  ) {
    assertOwnerOrAdmin(currentUser, id);
    const updateData = dto.password
      ? { ...dto, password: await bcrypt.hash(dto.password, SALT_ROUNDS) }
      : dto;
    return this.userRepository.updateUser(id, updateData);
  }

  async deleteUser(id: number, currentUser: CurrentUserPayload) {
    assertOwnerOrAdmin(currentUser, id);
    return this.userRepository.deleteUser(id);
  }
}
