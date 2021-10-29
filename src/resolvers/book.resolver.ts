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

@InputType()
class InputBookId {
  @Field()
  id!: number
}

@InputType()
class BookUpdateInput {
  @Field(() => String, {nullable: true})
  title?: string

  @Field(() => Number, {nullable: true})
  author?: number
}

@InputType()
class BookUpdateParseInput {
  @Field(() => String, {nullable: true})
  title?: string

  @Field(() => Number, {nullable: true})
  author?: Author
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

  @Query(() => [Book])
  async getAllBooks(): Promise<Book[]> {
    try {
      return this.bookRepository.find({ relations: ['author']})
    } catch (error) {
      throw new Error(error as string)
    }
  }

  @Query(() => Book)
  async getBookById(@Arg('input', () => InputBookId) input: InputBookId): Promise<Book | undefined> {
    try {
      const book = await this.bookRepository.findOne(input.id, {relations: ['author']})

      if (!book) {
        const error = new Error();
        error.message = "Book not found";
        throw error;
      }

      return book;
    } catch (error) {
      throw new Error(error as string)
    }
  }

  @Mutation(() => Boolean)
  async updateBook(
    @Arg('bookId', () => InputBookId) bookId: InputBookId,
    @Arg('input', () => BookUpdateInput) input: BookUpdateInput
  ): Promise<Boolean> {
    try {
      await this.bookRepository.update(bookId.id, await this.parseInput(input));
      return true;
    } catch (error) {
      throw new Error(error as string);
    }
  } 

  @Mutation(() => Boolean)
  async deleteBook(
    @Arg("bookId", () => InputBookId) bookId: InputBookId
  ): Promise<Boolean> {
    try {
      await this.bookRepository.delete(bookId.id);
      return true;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  private async parseInput(input: BookUpdateInput) {
    try {
      const _input: BookUpdateParseInput = {};

      if (input.title) {
        _input['title'] = input.title;
      }

      if (input.author) {
        const author = await this.authorRepository.findOne(input.author);
        if (!author) {
          throw new Error("This author doesn't exists");
        }
        _input['author'] = author;
      }

      return _input;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}