import { InputType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class UpdateBookInput {
  @Field(() => ID, { description: 'ID of the book to update' })
  id: string;

  @Field(() => String, { nullable: true, description: 'Updated book title' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @Field(() => String, { nullable: true, description: 'Updated genre' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  genre?: string;
}