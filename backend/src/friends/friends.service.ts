import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {User} from "../users/users.model";
import {UsersService} from "../users/users.service";
import {InfoFriendsDto} from "./dto/info-friends.dto";

@Injectable()
export class FriendsService {
    constructor(private userService: UsersService) {}

    async getFriendList(id: number): Promise<User[]> {
        let friendsList: User[] = [];
        // TODO empty list
        const user = await this.userService.getOneById(id);
        let array = user.friends;
        for (let value of user.friends) {
            let tmpUser = await this.userService.getOneById(value);
            friendsList.push(tmpUser);
        }
        return friendsList;
    }

    async addFriend(dto: InfoFriendsDto, id: number):  Promise<User>  {
        const user = await this.userService.getOneById(id);
        // TODO user not found

        if (id == dto.friendId) {
            throw new HttpException('You can\'t add yourself', HttpStatus.FORBIDDEN)
        }
        if (user.friends) {
            for (let value of user.friends) {
                if (dto.friendId == value) {
                    throw new HttpException('This user already your friend', HttpStatus.FORBIDDEN)
                }
            }
        }
        let arr: number[];
        if (!user.friends) {
            user.friends = []
        }
        arr = user.friends;
        arr.push(dto.friendId);
        user.friends = [];
        user.friends = arr;
        await user.update({friends: user.friends}, {where: {id: id}})
        return user;
    }

    async deleteFriend(dto: InfoFriendsDto, id: number):  Promise<User>   {
        const user = await this.userService.getOneById(id);
        // TODO user not found

        if (id == dto.friendId) {
            throw new HttpException('You can\'t delete yourself', HttpStatus.FORBIDDEN)
        }
        if (!user.friends) {
            throw new HttpException('Your friends list is empty ', HttpStatus.FORBIDDEN)
        }
        let array: number[] = user.friends;
        array.forEach(((element, index) => {
            if(element == dto.friendId) {
                array.splice(index, 1);
            }
        }));
        user.friends = [];
        if (array.length == 0) {
            await user.set('friends',  null);
            await user.save();
        }
        await user.update({friends: array}, {where: {id: id}});
        return user;
    }
}
