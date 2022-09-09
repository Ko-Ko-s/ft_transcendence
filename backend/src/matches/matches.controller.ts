import {Body, Controller, Get, HttpCode, HttpStatus, Post} from '@nestjs/common';
import {MatchesService} from "./matches.service";
import {MatchesDto} from "./dto/matches.dto";
import {Match} from "./matches.model";
import {User} from "../users/users.model";


@Controller('matches')
export class MatchesController {
    constructor(private matchesService: MatchesService) { }

    @Post('add')
    @HttpCode(HttpStatus.CREATED)
    createMatch(@Body() dto: MatchesDto): Promise <Match>{
        return this.matchesService.createMatch(dto)
    }

    @Get('all')
    @HttpCode(HttpStatus.OK)
    getAllMatches(): Promise<Match[]> {
        return this.matchesService.getAllMatches();
    }
}
