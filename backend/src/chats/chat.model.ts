import { Model, Column, DataType , Table } from "sequelize-typescript"
import {Expose} from "class-transformer";

@Table({tableName: 'chats', createdAt: false, updatedAt: false})
export class Chat extends Model {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type:DataType.INTEGER})
    owner: number;
    
    @Column
    chatType: string;
    
    @Column
    chatName: string;
    
    @Column
    password: string;

    @Expose()
    @Column({type: DataType.JSONB, allowNull: true})
    blockedUsers:  number[];
    
    @Expose()
    @Column({type: DataType.JSONB, allowNull: true})
    chatAdministrators:  number[];
    
    @Expose()
    @Column({type: DataType.JSONB, allowNull: true})
    bannedUsers:  number[];
    
    @Expose()
    @Column({type: DataType.JSONB, allowNull: true})
    mutedUsers:  number[];
    
    @Expose()
    @Column({type: DataType.JSONB, allowNull: true})
    chatUsers:  number[];
}