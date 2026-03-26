import { InputType, Field, ID, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateBookInput {
  @Field(() => String, { description: 'Book title' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @Field(() => String, { description: 'Genre of the book' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  genre: string;

  @Field(() => Int, { description: 'Year the book was published' })
  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  publishedYear: number;

  @Field(() => ID, { description: 'ID of the author' })
  @IsString()
  @IsNotEmpty()
  authorId: string;
}