import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { UserDetails } from './interfaces/userDetails.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(
    name: string,
    email: string,
    hashedPassword: string,
    phone: string,
    companyName: string,
    roles: string[],
    active: boolean,
  ): Promise<UserDocument> {
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      companyName,
      roles,
      active,
    });
    return newUser.save();
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      companyName: user.companyName,
      roles: user.roles,
    };
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel
      .updateOne(
        { _id: id },
        {
          email: updateUserDto?.email,
          password: updateUserDto?.password,
          name: updateUserDto?.name,
          phone: updateUserDto?.phone,
          companyName: updateUserDto?.companyName,
          roles: updateUserDto?.roles,
          active: updateUserDto?.active,
        },
      )
      .exec();
  }

  _getUserDetails(user: UserDocument): UserDetails {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      companyName: user.companyName,
      roles: user.roles,
      active: user.active,
    };
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDetails | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return null;
    return this._getUserDetails(user);
  }

  remove(id: string) {
    return this.userModel.deleteOne({ _id: id }).exec();
  }
}
