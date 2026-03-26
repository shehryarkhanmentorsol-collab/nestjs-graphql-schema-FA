// modules/book/book.repository.ts
// All Mongoose DB operations for Book live here.

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Book, BookDocument } from './entities/book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';

@Injectable()
export class BookRepository {
  constructor(
    @InjectModel(Book.name)
    private readonly bookModel: Model<BookDocument>,
  ) {}

  async create(createBookInput: CreateBookInput): Promise<BookDocument> {
    const book = new this.bookModel(createBookInput);
    return book.save();
  }

  async findAll(): Promise<BookDocument[]> {
    return this.bookModel.find().exec();
  }

  async findById(id: string): Promise<BookDocument | null> {
    return this.bookModel.findById(id).exec();
  }

  async findByAuthorId(authorId: string): Promise<BookDocument[]> {
    return this.bookModel.find({ authorId }).exec();
  }

  async update(
    id: string,
    updateBookInput: Partial<UpdateBookInput>,
  ): Promise<BookDocument | null> {
    return this.bookModel
      .findByIdAndUpdate(id, { $set: updateBookInput }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.bookModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}