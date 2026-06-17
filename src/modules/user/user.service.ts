import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../auth/auth.service';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private readonly authService: AuthService,
    ) { }

    async registerUser(data: any) {
        const { name, email, password } = data
        const checkEmailExists = await this.isEmailExists(email);
        if (checkEmailExists) {
            return {
                status: false,
                message: 'User already registered'
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
            status: true,
            message: 'User registered successfully',
            safeUser
        };
    }

    async loginUser(data: any) {
        const { name, email, password } = data
        const checkEmailExists = await this.isEmailExists(email);
        if (!checkEmailExists) {
            return {
                status: false,
                message: 'Invalid credentials'
            };
        }
        const isMatch = await bcrypt.compare(password, checkEmailExists.password);
        if (isMatch) {
            const jwtToken = await this.authService.loginUser(checkEmailExists);
            const { password: _, ...safeUser } = checkEmailExists;
            return {
                status: true,
                message: 'Login successfully',
                data: {
                    ...safeUser,
                    access_token: "Bearer "+jwtToken.access_token,
                },
            };
        } else {
            return {
                status: false,
                message: 'Invalid credentials'
            };
        }
    }

    async userProfile() {
        console.log("hello")
        return {
            status: true,
            message: 'Login successfully',
            data: "Check It "
        };
    }

    async isEmailExists(email) {
        const user = await this.userRepo.findOne({
            where: { email },
        });
        return user;
    }

}
