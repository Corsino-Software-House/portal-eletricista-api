import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClienteModule } from '../cliente/cliente.module';
import { ProfissionalModule } from '../profissional/profissional.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    ConfigModule, // importante importar para o ConfigService funcionar aqui
    ClienteModule,
    ProfissionalModule,
    AdminModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
