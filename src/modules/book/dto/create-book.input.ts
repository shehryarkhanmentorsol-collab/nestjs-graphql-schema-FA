import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateBookInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  genre: string;

  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  publishedYear: number;

  @IsString()
  @IsNotEmpty()
  authorId: string;
}