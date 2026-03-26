import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Book } from "../../book/entities/book.entity";
@Schema({ timestamps: true })
@ObjectType()
export class Author {
  // Expose MongoDB _id as a GraphQL ID field
  @Field(() => ID)
  _id: string;
 
  @Prop({ required: true, trim: true })
  @Field(() => String, { description: 'Full name of the author' })
  name: string;
 
  @Prop({ default: null })
  @Field(() => String, { nullable: true, description: 'Short biography' })
  bio?: string;
 
 @Field(() => [Book], {
  nullable: true,
  description: 'All books written by this author',
})
books?: Book[];
}
 
export type AuthorDocument = Author & Document;
export const AuthorSchema = SchemaFactory.createForClass(Author);