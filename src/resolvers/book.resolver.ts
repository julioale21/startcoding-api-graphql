import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { getRepository, Repository } from "typeorm";
import { Book } from './../entity/book.entity';
import { Author } from './../entity/author.entity';

@InputType()
class BookInput {
  @Field()
  title!: string

  @Field()
  author!: number 
}

@Resolver()
export class BookResolver {
  bookRepository: Repository<Book>;
  authorRepository: Repository<Author>;

  constructor() {
    this.bookRepository = getRepository(Book);
    this.authorRepository = getRepository(Author);
  }
  
  @Mutation(() => Book)
  async createBook(@Arg("input", () => BookInput) input: BookInput) {
    try {
      const author: Author | undefined = await this.authorRepository.findOne(input.author);

      if (!author) {
        const error = new Error();
        error.message = "The author for this book does not exists, please double check";
        throw error;
      }

      const book = await this.bookRepository.insert({
        title: input.title,
        author: author
      });

      return await this.bookRepository.findOne(book.identifiers[0].id, { relations: ["author"]});
    } catch (error) {
      throw new Error(error as string)
    }
  }
}