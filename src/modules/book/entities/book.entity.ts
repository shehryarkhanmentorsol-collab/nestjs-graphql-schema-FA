import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Book {
  // _id provided automatically by MongoDB

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  genre: string;

  @Prop({ required: true })
  publishedYear: number;

  // Stores the MongoDB ObjectId of the related Author document
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Author', required: true })
  authorId: string;
}

export type BookDocument = Book & Document;
export const BookSchema = SchemaFactory.createForClass(Book);