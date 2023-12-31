import { Table, Model, Column, DataType, AllowNull, AutoIncrement, PrimaryKey, Unique, Default, CreatedAt, UpdatedAt, BelongsTo, ForeignKey } from "sequelize-typescript";
import { User } from "./User";

@Table({
    timestamps: true,
    tableName: "publisher"
})

export class Publisher extends Model {
    @AllowNull(false)
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    id!: number;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER
    })
    userId!: number;

    @Unique
    @Column({
        type: DataType.STRING
    })
    username!: string

    @BelongsTo(() => User)
    user!: User

    @CreatedAt
    createdAt?: Date;

    @UpdatedAt
    updatedAt?: Date;
}