

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Author {
 
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: null })
  bio?: string;

}

export type AuthorDocument = Author & Document;

export const AuthorSchema = SchemaFactory.createForClass(Author);