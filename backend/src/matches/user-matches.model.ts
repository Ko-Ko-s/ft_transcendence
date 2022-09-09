import {BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../users/users.model";
import {Match} from "./matches.model";


@Table({tableName: 'user_matches', createdAt: false, updatedAt: false})
export class UserMatches extends  Model<UserMatches> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    playerId: number;

    @ForeignKey(() => Match)
    @Column({type: DataType.INTEGER, allowNull: false})
    matchId: number;
}