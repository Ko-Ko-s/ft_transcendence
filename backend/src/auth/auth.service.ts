import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';
import {User} from "../users/users.model";
import {CreateUserDto} from "../users/dto/create-user.dto";
import * as FormData from 'form-data';
import fetch from 'node-fetch';

import {request} from "https";
import {delay} from "rxjs";

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
                private jwtService: JwtService) {}

    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto);
        return this.generateToken(user);
    }

    // async registration42(userDto: CreateUserDto) {
    //     const user = await this.userService.createUser({...userDto, is42: true});
    //     return this.generateToken(user);
    // }

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.findByEmail(userDto.email);
        if (candidate) {
            throw  new HttpException('This email already exist!', HttpStatus.BAD_REQUEST);
        }
        const hashPass = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({...userDto, password: hashPass});
        return this.generateToken(user);
    }

    private async generateToken(user: User) {
        const payload = {id: user.id, email: user.email};
        //TODO role in token
        return { token: this.jwtService.sign(payload)};
    }

    private async validateOAuthUser(userDto: CreateUserDto) : Promise<number> {
        // если юзер есть и 42, возвращаем юзера, если его нет, возвращаем нулл и кидаем на регистрацию
        const candidate =  await this.userService.findByEmail(userDto.email);
        if (candidate && candidate.token42) {
            console.log(candidate.id);
            return candidate.id;
        }
        console.log(userDto)
        const newUser = await this.userService.createUser(userDto);
        console.log(newUser.id)
        return newUser.id;
    }
    // направлять сюда c OAuth

    private async validateUser(userDto: CreateUserDto) {
        //const is42 = await this.userService.is42(userDto.is42)
        //if (!is42)
        const user = await this.userService.findByEmail(userDto.email);
        const password = await bcrypt.compare(userDto.password, user.password);
        if (user && password) {
            return user;
        }
        throw new UnauthorizedException({message: 'Incorrect login or password'})
    }

    async response42(query: string): Promise<number> {
        const form = new FormData();

        form.append('grant_type', 'authorization_code');
        form.append('client_id', process.env.CLIENT_ID);
        form.append('client_secret', process.env.SECRET);
        form.append('code', query);
        form.append('redirect_uri', process.env.REDIRECT_BACK);

        let token: string
        let id: number
        const req = request(
            {
                host: 'api.intra.42.fr',
                port: '443',
                path: '/oauth/token',
                method: 'POST',
                headers: form.getHeaders(),
            },
            response => {
                console.log(response.statusCode); // 200
                response.on('data', async d => {
                    token = d.toString().split(',')[0];
                    token = token.split(':').pop();
                    token = token.substring(1, token.length - 1);
                    console.log(token);

                    let response = await fetch("https://api.intra.42.fr/v2/me", {
                        method: 'get',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    if (response.ok) {
                        const info = await response.json();
                        console.log(info.login);
                        console.log(info.email);
                        let dto: CreateUserDto;
                        dto = {
                            nick: info.login,
                            email: info.email,
                            token42: token
                        };
                        return id = await this.validateOAuthUser(dto);
                    } else {
                        throw new HttpException('Ошибка запроса данных пользовалтеля', HttpStatus.BAD_REQUEST)
                    }
                })
            }
        );
        form.pipe(req);

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        await sleep(15000);
        return id;
    }
}
