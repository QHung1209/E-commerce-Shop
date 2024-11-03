import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { compareSync, hashSync } from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) { }

  hashPassword = (password: string) => {
    return hashSync(password, 10);
  }
  async create(createUserDto: CreateUserDto) {

    const { email, password, name, address, age, phone, role } = createUserDto

    const isExists = await this.userModel.findOne({ email })
    if (isExists) {
      throw new BadRequestException("This user is already existed")
    }

    const newUser = await this.userModel.create({
      email,
      name,
      address,
      age,
      phone,
      role, password: this.hashPassword(password)
    })
    return newUser
  }

  checkUserPassword = (password: string, hashPassword: string) => {
    return compareSync(password, hashPassword)
  }

  async findByUsername(username: string) {
    return await this.userModel.findOne({ email: username })
  }

  async updateUserRefreshToken(refreshToken: string, id: string) {
    return await this.userModel.updateOne({ _id: id }, { refreshToken: refreshToken })
  }

  async findByUserId(userId: string) {
    return await this.userModel.findById(userId)
  }


  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
