import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
  UsePipes,
  Get,
  Param,
} from '@nestjs/common';
import { CurrentAccount } from 'src/common/decorators/current-user';
import { Roles } from 'src/common/decorators/role';
import { EnumRole } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { LocalAuthGuard } from 'src/common/guard/local-auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Account } from './account.entity';
import { AuthService } from './auth.service';
import { CreateAccountDto } from './dto/create.account';
import { LoginAccountDto } from './dto/login.account';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() accountDto: CreateAccountDto) {
    return this.authService.register(accountDto);
  }
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @UsePipes(ValidationPipe)
  login(
    @Body() loginAccountDto: LoginAccountDto,
    @CurrentAccount() account: Account,
  ) {
    return this.authService.generateToken(account);
  }

  @Get('accounts')
  @Roles(EnumRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  findAll() {
    return this.authService.findAll();
  }

  @Get('accounts/:id')
  findOne(@Param('id') id: string) {
    return this.authService.findOneById(+id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMyAccount(@CurrentAccount() account: Account) {
    return this.authService.findOneById(account.id);
  }
}
