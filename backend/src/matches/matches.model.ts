import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {Expose} from "class-transformer";
import {MatchesDto} from "../matches/dto/matches.dto";
import {User} from "../users/users.model";
import {UserMatches} from "./user-matches.model";

interface MatchCreationAttribute {
    playerOneId: number;
    playerTwoId: number;
    winnerId: number;
    // score: string;
//    TODO score
}

@Table({tableName: 'matches'})
export class Match extends  Model<Match, MatchCreationAttribute>{

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.INTEGER, allowNull: false})
    playerOneId: number;

    @Column({type: DataType.INTEGER, allowNull: false})
    playerTwoId: number;

    @Column({type: DataType.INTEGER, allowNull: false})
    winnerId: number;

    @BelongsToMany(() => User, () => UserMatches)
    user: User[];



//   matches
//     Колонку объявить нужно примерно так:
//
//     @Column({ type: 'jsonb', nullable: true })
//     payloadBody: string;
//

}
