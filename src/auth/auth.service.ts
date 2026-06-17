import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    async loginUser(user: any) {
        const payload = {
            sub: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

}

