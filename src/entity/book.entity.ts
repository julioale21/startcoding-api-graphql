import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Author } from "./author.entity";
@ObjectType()
@Entity()
export class Book {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column()
  title!: string

  @Field()
  @ManyToOne(() => Author, author => author.books )
  author!: Author

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: string
}