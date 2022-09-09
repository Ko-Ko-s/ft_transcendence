export class CreateChatDto {
    readonly id: number
    readonly owner: number
    readonly chatType: string
    readonly chatName: string
    readonly password: string
    readonly blockedUsers: number[]
    readonly chatAdministrators: number[]
    readonly bannedUsers: number[]
    readonly mutedUsers: number[]
    readonly chatUsers: number[]
}