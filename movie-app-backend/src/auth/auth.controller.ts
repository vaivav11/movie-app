// import { Controller, Post, Body } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { User } from '../users/interfaces/user.interface';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('login')
//   async login(@Body() body: CreateUserDto) {
//     return this.authService.login(body);
//   }

//   @Post('register')
//   async register(@Body() body: CreateUserDto): Promise<User> {
//     return this.authService.register(body);
//   }
// }
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { User } from '../users/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string, password: string }) {
    return this.authService.login(body);
  }

  @Post('register')
  async register(@Body() body: User) {
    return this.authService.register(body);
  }

  @UseGuards(AuthGuard)
  @Post('validate-token')
  async validateToken(@Body('token') token: string) {
    return this.authService.validateToken(token);
  }
}
