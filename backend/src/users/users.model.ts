import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {Expose} from "class-transformer";
import {Match} from "../matches/matches.model";
import {UserMatches} from "../matches/user-matches.model";

interface UserCreationAttribute {
    nick: string;
    email: string;
    password?: string;
    token42?: string;
}

@Table({tableName: 'users'})
export class User extends  Model<User, UserCreationAttribute>{

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    nick: string;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @Column({type: DataType.STRING, allowNull: true})
    password: string;

    @Column({type: DataType.STRING, allowNull: true})
    avatar: string;

    @Column({type: DataType.STRING, allowNull: true})
    token42: string;

    @Column({type: DataType.STRING, allowNull: true})
    onOffMode: string;

    @Column({type: DataType.BOOLEAN, allowNull: true, defaultValue: false})
    twoFactorAuth: boolean;

    @Expose()
    @Column({type: DataType.JSONB, allowNull: true})
    friends: number[];

    @BelongsToMany(() => Match, () => UserMatches)
    matches: Match[];


}
