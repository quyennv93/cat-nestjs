import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CatModule } from './cat/cat.module';

@Module({
  imports: [AuthModule, CatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
