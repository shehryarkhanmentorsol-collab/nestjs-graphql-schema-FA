import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { AuthorService } from './author.service';
import type { AuthorDocument } from './entities/author.entity';
import { CreateAuthorInput } from './dto/create-author.input';
import { BookService } from '../book/book.service';
import { Author, Book } from '../../graphql/generated';

@Resolver('Author')
export class AuthorResolver {
  constructor(
    private readonly authorService: AuthorService,
    private readonly bookService: BookService,
  ) {} 

  // Mutations

  @Mutation('createAuthor')
  async createAuthor(
    @Args('createAuthorInput') createAuthorInput: CreateAuthorInput,
  ): Promise<Author> {
    return this.authorService.create(createAuthorInput);
  }


  // Queries 

  @Query('authors')
  async findAll(): Promise<Author[]> {
    return this.authorService.findAll();
  }

 @Query('author')
  async findOne(
    @Args('id') id: string,
  ): Promise<Author> {
    return this.authorService.findOne(id);
  }
 

  //  Relation: Author → Books 
  @ResolveField('books')
  async resolveBooks(@Parent() author: AuthorDocument): Promise<Book[]> {
    // Safely get the string ID from the Mongoose document
    const authorId = ((author as any)._id ?? (author as any).id).toString();
    return this.bookService.findByAuthorId(authorId);
  }
}