import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from 'src/helpers/helpers';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ExistingUserDto } from 'src/user/dto/existing-user-dto';
import { UserDetails } from 'src/user/interfaces/userDetails.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  register(@Body() user: CreateUserDto): Promise<UserDetails | null> {
    return this.authService.register(user);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  login(@Body() user: ExistingUserDto): Promise<{ token: string } | null> {
    return this.authService.login(user);
  }
}
