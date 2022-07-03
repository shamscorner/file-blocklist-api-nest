import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { validate } from './env.validation';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './features/users/users.module';
import appConfig, { throttleModuleAsyncOptions } from './config/app.config';
import databaseConfig from './config/database.config';
import typeormConfig from './config/typeorm.config';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';
import { DatabaseFilesModule } from './features/database-files/database-files.module';
import { LogsMiddleware } from './utils/logs.middleware';
import { HealthModule } from './health/health.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { bullModuleOptions } from './config/bull.config';
import { RequestsModule } from './features/requests/requests.module';

@Module({
  imports: [
    ThrottlerModule.forRootAsync(throttleModuleAsyncOptions),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      validate,
      load: [appConfig, databaseConfig, typeormConfig, jwtConfig, redisConfig],
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthenticationModule,
    HealthModule,
    BullModule.forRootAsync(bullModuleOptions),
    EventEmitterModule.forRoot(),
    UsersModule,
    DatabaseFilesModule,
    RequestsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    // {
    //   provide: APP_FILTER,
    //   useClass: ExceptionsLoggerFilter,
    // },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ExcludeNullInterceptor,
    // },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
