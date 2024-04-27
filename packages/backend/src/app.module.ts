import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthenticationModule } from "./authentication";
import { AuthenticationMiddleware } from "./authentication/middleware";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import configuration from "./config/configuration";
import { SecretsModule } from "./secrets/secrets.module";
import { SecretsService } from "./secrets/SecretsService";
import { SsiModule } from "./ssi/ssi.module";

@Module({
  imports: [
    AuthenticationModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true
    }),
    SecretsModule,
    SsiModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, SecretsModule],
      useFactory: (configService: ConfigService, secretsService: SecretsService) => ({
        type: "postgres",
        host: configService.get("db.host"),
        port: configService.get("db.port"),
        username: configService.get("db.user"),
        database: configService.get("db.database"),
        synchronize: configService.get("db.synchronize"),
        logging: configService.get("db.debug"),
        autoLoadEntities: true
      }),
      inject: [ConfigService, SecretsService]
    }),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes("*");
  }
}
