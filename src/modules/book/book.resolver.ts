import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import type { BookDocument } from './entities/book.entity';
import { BookService } from "./book.service";
import { AuthorService } from "../author/author.service";
import { CreateBookInput } from "./dto/create-book.input";
import { UpdateBookInput } from "./dto/update-book.input";
import { Book, Author } from '../../graphql/generated';

@Resolver('Book')
export class BookResolver {
  constructor(
    private readonly bookService: BookService,
    private readonly authorService: AuthorService,
  ) {}
 
 @Mutation('createBook')
  async createBook(
    @Args('createBookInput') createBookInput: CreateBookInput,
  ): Promise<Book> {
    return this.bookService.create(createBookInput);
  }
 
    
  @Mutation('updateBook')
  async updateBook(
    @Args('updateBookInput') updateBookInput: UpdateBookInput,
  ): Promise<Book> {
    return this.bookService.update(updateBookInput);
  }
 
  // deleteBook returns Boolean — no interface needed, just Promise<boolean>
  @Mutation('deleteBook')
  async deleteBook(@Args('id') id: string): Promise<boolean> {
    return this.bookService.delete(id);
  }


  
  @Query('books')
  async findAll(): Promise<Book[]> {
    return this.bookService.findAll();
  }
 
  @Query('book')
  async findOne(@Args('id') id: string): Promise<Book> {
    return this.bookService.findOne(id);
  }

    @ResolveField('author')
  async resolveAuthor(@Parent() book: BookDocument): Promise<Author> {
    return this.authorService.findOne(book.authorId.toString());
  }
}