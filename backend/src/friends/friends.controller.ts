import {Body, Controller, Get, Param, Put} from '@nestjs/common';
import {FriendsService} from "./friends.service";
import {User} from "../users/users.model";
import {InfoFriendsDto} from "./dto/info-friends.dto";

@Controller('friends')
export class FriendsController {
    constructor(private friendsService: FriendsService) {}

    @Get('all/:id')
    getAllFriends(@Param('id') id: number): Promise<User[]>  {
        // TODO
        return this.friendsService.getFriendList(id);
    }

    @Put('add/:id')
    addFriend(@Body() dto: InfoFriendsDto, @Param('id') id: number): Promise<User>  {
        return this.friendsService.addFriend(dto, id);
    }

    @Put('delete/:id')
    deleteFriend(@Body() dto: InfoFriendsDto, @Param('id') id: number): Promise<User>  {
        return this.friendsService.deleteFriend(dto, id);
    }
}
