import { Module } from '@nestjs/common';

import {FriendsController} from "./friends.controller";
import {FriendsService} from "./friends.service";
import {UsersModule} from "../users/users.module";


@Module({
    controllers: [FriendsController],
    providers: [FriendsService],
    imports: [
        UsersModule,
    ]
})
export class FriendsModule {}
