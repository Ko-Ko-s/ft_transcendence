import { Injectable } from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {InjectModel} from "@nestjs/sequelize";
import {Match} from "./matches.model";
import {MatchesDto} from "./dto/matches.dto";
import {User} from "../users/users.model";

@Injectable()
export class MatchesService {
    constructor(private userService: UsersService, @InjectModel(Match) private matchRepository: typeof Match) {}

    async createMatch(dto: MatchesDto) {
        const match = await this.matchRepository.create(dto);
        const player1 = await this.userService.getOneById(dto.playerOneId);
        const player2 = await this.userService.getOneById(dto.playerTwoId);
        // TODO fix matches array

        // player1.matches = []
        let pArr1 = player1.matches;
        let pArr2 = player2.matches;
        pArr1.push(match)
        pArr2.push(match)

        // console.log(pArr2);
        // console.log(match);
        // console.log(pArr2)

        // pArr1.push(match);
        // pArr2.push(match);
        // player1.matches.push(match);
        // player2.matches.push(match);
        //
        // await player1.update({matches: player1.matches});
        // await player2.update({matches: player2.matches});
        // await player2.update("matches", player1.matches);
        // await player1.save();
        // await player2.save();
        await player1.$set('matches', pArr1)
        await player2.$set('matches', pArr2)
        // player1.matches = [match];
        // player2.matches = [match];
        return match;
    }

    async getAllMatches(): Promise<Match[]> {
        const matches = this.matchRepository.findAll();
        return matches;
    }
}
