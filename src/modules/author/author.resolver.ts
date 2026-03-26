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
import { Author} from './entities/author.entity';
import type { AuthorDocument } from './entities/author.entity';
import { CreateAuthorInput } from './dto/create-author.input';
import { BookService } from '../book/book.service';
import { Book } from '../book/entities/book.entity';

@Resolver(() => Author)
export class AuthorResolver {
  constructor(
    private readonly authorService: AuthorService,
    
    private readonly bookService: BookService,
  ) {}

  // Mutations

  @Mutation(() => Author, { description: 'Create a new author' })
  createAuthor(
    @Args('createAuthorInput') createAuthorInput: CreateAuthorInput,
  ): Promise<Author> {
    return this.authorService.create(createAuthorInput);
  }

  // Queries 

  @Query(() => [Author], { name: 'authors', description: 'Get all authors' })
  findAll(): Promise<Author[]> {
    return this.authorService.findAll();
  }

  @Query(() => Author, {
    name: 'author',
    description: 'Get a single author by ID with their books',
  })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<Author> {
    return this.authorService.findOne(id);
  }

  //  Relation: Author → Books 

  @ResolveField(() => [Book], {
    name: 'books',
    description: 'All books written by this author',
  })
  async resolveBooks(@Parent() author: AuthorDocument): Promise<Book[]> {
    const authorId = ((author as any)._id ?? (author as any).id).toString();
    return this.bookService.findByAuthorId(authorId);
  }
}