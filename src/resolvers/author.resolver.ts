import { Mutation, Query, Resolver } from "type-graphql";
import { Author } from './../entity/author.entity';

@Resolver()
export class AuthorResolver {

  @Mutation(() => Author)
  async createAuthor() {

  }
}