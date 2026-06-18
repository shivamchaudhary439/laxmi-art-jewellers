import { Controller, Get, Post, Body, HttpCode, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/login-user.dto';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { USER_ROLES } from '../../common/constants/app.constants';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }


    @Post('register')
    register(@Body() body: UserRegisterDto) {
        return this.userService.registerUser(body);
    }

    @Post('login')
    login(@Body() body: UserLoginDto) {
        return this.userService.loginUser(body);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(USER_ROLES.ADMIN, USER_ROLES.USER)
    @Get('profile')
    userProfile(@Req() req) {
        return req.headers;
    }
}
