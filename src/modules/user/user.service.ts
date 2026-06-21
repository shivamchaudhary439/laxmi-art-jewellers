import { BadRequestException, HttpException, Injectable, HttpStatus, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../auth/auth.service';
import { MESSAGES } from '../../common/constants/message.constants';
import { STATUS, BOOLEAN } from '../../common/constants/app.constants';
import { InternalServerErrorException } from '@nestjs/common';
import { CryptoService } from '../../crypto/crypto.service';
// import { HttpException, HttpStatus } from '@nestjs/common';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private readonly authService: AuthService,
        private readonly cryptoService: CryptoService,
    ) { }

    async registerUser(data: any) {
        try {
            const { name, email, password } = data
            const checkEmailExists = await this.isEmailExists(email);
            if (checkEmailExists) {
                return {
                    status: STATUS.INACTIVE,
                    message: MESSAGES.USER_ALREADY_EXISTS
                };
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = this.userRepo.create({
                name,
                email,
                password: hashedPassword,
            });
            const result = await this.userRepo.save(user);
            const { password: _, ...safeUser } = result;
            return {
                status: STATUS.ACTIVE,
                message: MESSAGES.USER_CREATED,
                safeUser
            };
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                MESSAGES.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async loginUser(data: any) {
        try {
            const { name, email, password, details } = data
            const checkEmailExists = await this.isEmailExists(email);

            // const encrypted = this.cryptoService.encrypt({
            //     name,
            //     email,
            //     password
            // });
            // console.log(encrypted)
            // if (encrypted.startsWith('ENC:')) {
            //     console.log('Encrypted', encrypted);
            // } else {
            //     console.log('Plain Text');
            // }
            // console.log('Encrypted:', encrypted);
            console.log('Encrypted:');
            // const decrypted = this.cryptoService.decrypt(details);
            // console.log('decrypted:', decrypted.response);
            try {
                const decrypted = this.cryptoService.decrypt(details);
                console.log('decrypted:', decrypted);
                // aage ka logic
            } catch (error) {
                // console.log('Decrypt Error:', error);
                console.error("error ",error);
                 throw new HttpException(
                    {
                        status: STATUS.INACTIVE,
                        message:  MESSAGES.INTERNAL_SERVER_ERROR,
                    },
                    HttpStatus.FORBIDDEN,
                );
                // throw new BadRequestException(
                //     MESSAGES.INTERNAL_SERVER_ERROR,
                // );
                // return {
                //     status: STATUS.INACTIVE,
                //     message: 'Invalid encrypted data',
                // };
            }
            // if (decrypted.status === BOOLEAN.FALSE) {
            //     console.log("fhagghldsak")
            //     throw new HttpException(
            //         {
            //             status: STATUS.INACTIVE,
            //             message: decrypted.message,
            //         },

            //         HttpStatus.FORBIDDEN,
            //     );
            // }
            // console.log("decrypted ", decrypted)


            if (!checkEmailExists) {
                return {
                    status: STATUS.INACTIVE,
                    message: MESSAGES.INVALID_CREDENTIALS
                };
            }
            const isMatch = await bcrypt.compare(password, checkEmailExists.password);
            if (isMatch) {
                const jwtToken = await this.authService.loginUser(checkEmailExists);
                const { password: _, ...safeUser } = checkEmailExists;
                return {
                    status: STATUS.ACTIVE,
                    message: MESSAGES.LOGIN_SUCCESS,
                    data: {
                        ...safeUser,
                        access_token: "Bearer " + jwtToken.access_token,
                    },
                };
            } else {
                return {
                    status: STATUS.INACTIVE,
                    message: MESSAGES.INVALID_CREDENTIALS
                };
            }
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                MESSAGES.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async userProfile() {
        return {
            status: STATUS.ACTIVE,
            message: 'Login successfully',
            data: "Check It "
        };
    }

    async isEmailExists(email: string) {
        const user = await this.userRepo.findOne({
            where: { email },
        });
        return user;
    }

}
