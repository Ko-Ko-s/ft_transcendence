import {Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {CreateUserDto} from "../users/dto/create-user.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('intra/:query')
    async getIntraToken(@Param('query') query: string): Promise<number> {
        return await this.authService.response42(query);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() userDto: CreateUserDto) {
        return this.authService.login(userDto);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('registration')
    registration(@Body() userDto: CreateUserDto) {
        return this.authService.registration(userDto);
    }
}
