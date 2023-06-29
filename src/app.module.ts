import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreamersModule } from './streamers/streamers.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'streamers.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      // logging: true,
    }),
    StreamersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
