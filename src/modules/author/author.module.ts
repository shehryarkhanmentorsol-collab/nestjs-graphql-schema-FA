
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
 
import { Author, AuthorSchema } from './entities/author.entity';
import { AuthRepository } from './author.repository';
import { AuthorService } from './author.service';
import { AuthorResolver } from './author.resolver';
import { BookModule } from '../book/book.module';
 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]),
    forwardRef(() => BookModule),
  ],
  providers: [AuthorResolver, AuthorService, AuthRepository],
  exports: [AuthorService],
})
export class AuthorModule {}