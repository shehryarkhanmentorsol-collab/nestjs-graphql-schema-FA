import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { AuthorService } from './author.service';
import { BookService } from '../book/book.service';
import type { AuthorDocument } from './entities/author.entity'; // ← import type
import { CreateAuthorInput } from './dto/create-author.input';
import { GQL_Author, GQL_Book } from '../../graphql/generated';

@Resolver('Author')
export class AuthorResolver {
  constructor(
    private readonly authorService: AuthorService,
    private readonly bookService: BookService,
  ) {}

  @Mutation('createAuthor')
  async createAuthor(
    @Args('createAuthorInput') input: CreateAuthorInput,
  ): Promise<any> {                    
    
    return this.authorService.create(input);
  }

  @Query('authors')
  async findAll(): Promise<any[]> {    
    return this.authorService.findAll();
  }

  @Query('author')
  async findOne(@Args('id') id: string): Promise<any> {   
    (id);
  }

  @ResolveField('books')
  async resolveBooks(@Parent() author: AuthorDocument): Promise<any[]> {  
    const authorId = ((author as any)._id ?? (author as any).id).toString();
    return this.bookService.findByAuthorId(authorId);
  }
}