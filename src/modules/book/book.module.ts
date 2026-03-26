// modules/book/book.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Book, BookSchema } from './entities/book.entity';
import { BookRepository } from './book.repository';
import { BookService } from './book.service';
import { BookResolver } from './book.resolver';
import { AuthorModule } from '../author/author.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    forwardRef(() => AuthorModule),
  ],
  providers: [BookResolver, BookService, BookRepository],
  exports: [BookService],
})
export class BookModule {}