import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Author } from './../entity/author.entity';
import { getRepository, Repository } from "typeorm";
@InputType()
class AuthorInput {
  @Field()
  fullName!: string
}

@Resolver()
export class AuthorResolver {

  authorRepository: Repository<Author>;

  constructor() {
    this.authorRepository = getRepository(Author);
  }

  @Mutation(() => Author)
  async createAuthor(@Arg("input", () => AuthorInput ) input: AuthorInput) : Promise<Author | undefined> {
        try {
          const createdAuthor = await this.authorRepository.insert({
            fullName: input.fullName
          });
          const result = await this.authorRepository.findOne(createdAuthor.identifiers[0].id);
          return result;
        } catch (error) {
          console.error(error)
        }
  }

  @Query(() => [Author])
  async getAllAuthors() {
    const authors = await this.authorRepository.find();
    return authors;
  }
}