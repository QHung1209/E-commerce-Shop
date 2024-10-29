import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    age: number

    @IsNotEmpty()
    role: string
}
