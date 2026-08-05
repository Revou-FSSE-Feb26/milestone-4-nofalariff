import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  getAllUsers() {
    return this.userRepository.getAllUsers();
  }

  getUserById(id: number) {
    return this.userRepository.getUserById(id);
  }

  createUser(dto: CreateUserDto) {
    return this.userRepository.createUser(dto);
  }

  updateUser(id: number, dto: UpdateUserDto) {
    return this.userRepository.updateUser(id, dto);
  }

  deleteUser(id: number) {
    return this.userRepository.deleteUser(id);
  }
}
