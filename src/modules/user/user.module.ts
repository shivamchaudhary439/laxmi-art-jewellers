import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../../auth/auth.service';
import { AuthModule } from '../../auth/auth.module';
import { CryptoModule } from '../../crypto/crypto.module';
@Module({
    controllers: [UserController],
    providers: [UserService,AuthService],
    imports: [
        TypeOrmModule.forFeature([User]),
        AuthModule,
        CryptoModule
    ],
})
export class UserModule { }
