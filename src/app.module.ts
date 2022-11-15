import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CatModule } from './cat/cat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodModule } from './food/food.module';

@Module({
  imports: [
    AuthModule,
    CatModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'testcat',
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: true,
      username: 'root',
      password: '123456',
    }),
    FoodModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
