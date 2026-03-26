import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Book } from "./entities/book.entity";
import type { BookDocument } from './entities/book.entity';
import { BookService } from "./book.service";
import { AuthorService } from "../author/author.service";
import { CreateBookInput } from "./dto/create-book.input";
import { UpdateBookInput } from "./dto/update-book.input";
import { Author } from "../author/entities/author.entity";


@Resolver(()=> Book)
export class BookResolver {
    constructor(private readonly bookService: BookService,
                private readonly authorService: AuthorService,
    ){}

    @Mutation(()=> Book, {description: "Create new Book"})
    createBook(@Args('createBookInput') createBookInput: CreateBookInput): Promise<Book>{
        return this.bookService.create(createBookInput)
    }

    
  @Mutation(() => Book, { description: 'Update an existing book (partial)' })
  updateBook(
    @Args('updateBookInput') updateBookInput: UpdateBookInput,
  ): Promise<Book> {
    return this.bookService.update(updateBookInput);
  }
 
  @Mutation(() => Boolean, {
    description: 'Delete a book by ID — returns true if deleted',
  })
  deleteBook(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.bookService.delete(id);
  }


  
  @Query(() => [Book], { name: 'books', description: 'Get all books' })
  findAll(): Promise<Book[]> {
    return this.bookService.findAll();
  }
 
  @Query(() => Book, { name: 'book', description: 'Get a single book by ID' })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<Book> {
    return this.bookService.findOne(id);
  }

   @ResolveField(() => Author, {
    name: 'author',
    description: 'Full author object for this book',
  })
  async resolveAuthor(@Parent() book: BookDocument): Promise<Author> {
    return this.authorService.findOne(book.authorId.toString());
  }
}