import { IsEmail, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterDto {

    @ApiProperty({
        required: true,
        example: 'Shivam'
    })
    @IsString()
    name!: string;

    @ApiProperty({
        required: true,
        example: 'shivam@gmail.com'
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        required: true,
        example: 'Roorkee@123',
        description: 'Password must be 8+ chars with uppercase, lowercase, number & symbol'
    })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
        { message: 'Password must be 8+ chars with uppercase, lowercase, number & symbol' }
    )
    password!: string;
}