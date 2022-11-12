import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserDetails } from 'src/user/interfaces/userDetails.interface';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { ExistingUserDto } from 'src/user/dto/existing-user-dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    // const salt = bcrypt.genSalt(10);
    // const hash = await bcrypt.hash(password, salt);
    // return hash;
    return bcrypt.hash(password, 12);
  }

  async register(
    user: Readonly<CreateUserDto>,
  ): Promise<UserDetails | null | any> {
    const { name, email, password, phone, companyName, roles, active } = user;

    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) return 'Email Taken!';

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userService.create(
      name,
      email,
      hashedPassword,
      phone,
      companyName,
      roles,
      active,
    );

    return this.userService._getUserDetails(newUser);
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDetails | null> {
    const user = await this.userService.findByEmail(email);
    const doesUserExist = !!user;

    if (!doesUserExist) return null;

    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );

    if (!doesPasswordMatch) return null;

    return this.userService._getUserDetails(user);
  }

  async login(
    existingUser: ExistingUserDto,
  ): Promise<{ token: string } | null> {
    const { email, password } = existingUser;

    const user = await this.validateUser(email, password);

    if (!user) return null;

    const jwt = await this.jwtService.signAsync({ user });

    return { token: jwt };
  }
}
