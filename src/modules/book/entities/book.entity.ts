import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';
import type { Author } from '../../author/entities/author.entity';

@Schema({ timestamps: true })
@ObjectType()
export class Book {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true, trim: true })
  @Field(() => String, { description: 'Title of the book' })
  title: string;

  @Prop({ required: true, trim: true })
  @Field(() => String, { description: 'Genre of the book' })
  genre: string;

  @Prop({ required: true })
  @Field(() => Int, { description: 'Year the book was published' })
  publishedYear: number;

  // Stored in MongoDB as an ObjectId reference to the Author document
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Author', required: true })
  @Field(() => ID, { description: 'ID of the author' })
  authorId: string;

  
  @Field(() => String, {
    nullable: true,
    description: 'Full Author object — resolved via @ResolveField',
  })
  author?: Author;
}

export type BookDocument = Book & Document;
export const BookSchema = SchemaFactory.createForClass(Book);