import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { BookService } from './book.service';
import { AuthorService } from '../author/author.service';
import type { BookDocument } from './entities/book.entity';  // ← import type
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { GQL_Book, GQL_Author } from '../../graphql/generated';

@Resolver('Book')
export class BookResolver {
  constructor(
    private readonly bookService: BookService,
    private readonly authorService: AuthorService,
  ) {}

  @Mutation('createBook')
  async createBook(
    @Args('createBookInput') input: CreateBookInput,
  ): Promise<any> {                   
    return this.bookService.create(input);
  }

  @Mutation('updateBook')
  async updateBook(
    @Args('updateBookInput') input: UpdateBookInput,
  ): Promise<any> {                   
    return this.bookService.update(input);
  }

  @Mutation('deleteBook')
  async deleteBook(@Args('id') id: string): Promise<boolean> {
    return this.bookService.delete(id);
  }

  @Query('books')
  async findAll(): Promise<any[]> {  
    return this.bookService.findAll();
  }

  @Query('book')
  async findOne(@Args('id') id: string): Promise<any> {  
    return this.bookService.findOne(id);
  }

  @ResolveField('author')
  async resolveAuthor(@Parent() book: BookDocument): Promise<any> {  
    return this.authorService.findOne(book.authorId.toString());
  }
}