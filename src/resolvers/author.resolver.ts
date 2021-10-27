import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Author } from './../entity/author.entity';
import { getRepository, Repository } from "typeorm";
@InputType()
class AuthorInput {
  @Field()
  fullName!: string
}

@InputType()
class AuthorUpdateInput {
  @Field(() => Number)
  id!: number

  @Field()
  fullName?: string
}

@InputType()
class AuthorInputId {
  @Field(() => Number)
  id!: number
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
  async getAllAuthors(): Promise<Author[]> {
    const authors = await this.authorRepository.find();
    return authors;
  }

  @Query(() => Author)
  async getAuthorById(@Arg("input", () => AuthorInputId) input: AuthorInputId) : Promise<Author | undefined> {
    try {
      const author = await this.authorRepository.findOne(input.id);

      if (!author) {
        const error = new Error();
        error.message = "Author does not exists";
        throw error;
      }
      return author;
    } catch (e) {
      throw new Error(e as string)
    }
  }

  @Mutation(() => Author)
  async updateAuthor(@Arg("input", () => AuthorUpdateInput) input: AuthorUpdateInput): Promise<Author | undefined> {
    const authorExist = await this.authorRepository.findOne(input.id);

    if (!authorExist) throw new Error("Author doesn't exists");

    const updatedAuthor = await this.authorRepository.save({
      id: input.id,
      fullName: input.fullName
    })

    return await this.authorRepository.findOne(updatedAuthor.id)
  }

  @Mutation(() => Boolean)
  async deleteAuthor(@Arg("input", () => AuthorInputId) input: AuthorInputId) : Promise<Boolean> {
    try {
      await this.authorRepository.delete(input.id)
      return true;
    } catch (error) {
      throw new Error("Operation failed")
    }
  }
}