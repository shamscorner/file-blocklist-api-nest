import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({
    description: 'All the users have been fetched successfully!',
    type: [User],
  })
  findAll() {
    return this.usersService.getAllUsers();
  }

  @Get(':email')
  @ApiParam({
    name: 'email',
    required: true,
    description: 'Should be a valid email for the user to fetch',
    type: String,
  })
  @ApiOkResponse({
    description: 'A user with the email has been fetched successfully!',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'A user with given email does not exist.',
  })
  findOne(@Param('email') email: string) {
    return this.usersService.getByEmail(email);
  }
}
