import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDetails } from './interfaces/userDetails.interface';
import { Roles } from 'src/auth/guards/role/roles.decorator';
import { Role } from './schemas/role.enum';
import { RolesGuard } from 'src/auth/guards/role/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(RolesGuard)
  @Get(':id')
  @Roles(Role.SuperAdmin)
  getUserById(@Param('id') id: string): Promise<UserDetails | null> {
    return this.userService.findById(id);
  }
}

// @Post()
// create(@Body() createUserDto: CreateUserDto) {
//   return this.userService.create(createUserDto);
// }

// @Get()
// findAll() {
//   return this.userService.findAll();
// }

// @Get(':id')
// findOne(@Param('id') id: string) {
//   return this.userService.findOne(id);
// }

// @Patch(':id')
// update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
//   return this.userService.update(id, updateUserDto);
// }

// @Delete(':id')
// remove(@Param('id') id: string) {
//   return this.userService.remove(id);
// }
// @Roles(Role.SuperAdmin)
