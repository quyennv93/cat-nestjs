import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Account } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateAccountDto } from './dto/create.account';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    private jwtService: JwtService,
  ) {}

  async register(accountDto: CreateAccountDto): Promise<CreateAccountDto> {
    const hashPassword = await this.hashPassword(accountDto.password);
    await this.accountRepo.save({ ...accountDto, password: hashPassword });
    return accountDto;
  }

  async login(username: string, password: string) {
    const account = await this.findOneByUsername(username);
    if (account) {
      if (await this.comparePassword(password, account.password)) {
        return account;
      }
    }
    throw new UnauthorizedException();
  }

  async generateToken(payload: Account) {
    return this.jwtService.sign({
      id: payload.id,
    });
  }
  async hashPassword(password: string): Promise<any> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }

  async findOneByUsername(username: string): Promise<Account> {
    return await this.accountRepo.findOne({ where: { username } });
  }

  async findOneById(id: number): Promise<Account> {
    return await this.accountRepo.findOne({
      where: { id },
      relations: ['cats'],
    });
  }

  async findAll() {
    return await this.accountRepo.find();
  }
}
