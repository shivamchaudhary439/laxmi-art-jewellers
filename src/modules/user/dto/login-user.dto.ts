import { IsEmail, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
    @ApiProperty({
        example: 'shivam@gmail.com'
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: 'Roorkee@123'
    })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
        { message: 'Password must be 8+ chars with uppercase, lowercase, number & symbol' }
    )
    password!: string;
}