// modules/book/book.service.ts
// Business logic layer for Book.
// Service calls repository; resolver calls service.

import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { BookDocument } from './entities/book.entity';
import { BookRepository } from './book.repository';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  async create(createBookInput: CreateBookInput): Promise<BookDocument> {
    try {
      return await this.bookRepository.create(createBookInput);
    } catch (error) {
  if (error instanceof NotFoundException) throw error;

  if (error instanceof Error) {
    throw new Error(`Failed to create book: ${error.message}`);
  }

  throw new Error('Failed to create book: Unknown error');
}
  }

  async findAll(): Promise<BookDocument[]> {
    try {
      return await this.bookRepository.findAll();
    } catch (error) {
  if (error instanceof NotFoundException) throw error;

  if (error instanceof Error) {
    throw new Error(`Failed to fetch book: ${error.message}`);
  }

  throw new Error('Failed to fetch book: Unknown error');
}
  }

  async findOne(id: string): Promise<BookDocument> {
    try {
      const book = await this.bookRepository.findById(id);
      if (!book) {
        throw new NotFoundException(`Book with ID "${id}" not found`);
      }
      return book;
    } catch (error) {
  if (error instanceof NotFoundException) throw error;

  if (error instanceof Error) {
    throw new Error(`Failed to fetch book: ${error.message}`);
  }

  throw new Error('Failed to fetch book: Unknown error');
}
  }

  async findByAuthorId(authorId: string): Promise<BookDocument[]> {
    try {
      return await this.bookRepository.findByAuthorId(authorId);
    } catch (error) {
  if (error instanceof NotFoundException) throw error;

  if (error instanceof Error) {
    throw new Error(`Failed to fetch book for author: ${error.message}`);
  }

  throw new Error('Failed to fetch book for author');
}
  }

  async update(updateBookInput: UpdateBookInput): Promise<BookDocument> {
    try {
      const { id, ...rest } = updateBookInput;
      const updated = await this.bookRepository.update(id, rest);
      if (!updated) {
        throw new NotFoundException(`Book with ID "${id}" not found`);
      }
      return updated;
    } catch (error) {
  if (error instanceof NotFoundException) throw error;

  if (error instanceof Error) {
    throw new Error(`Failed to update book: ${error.message}`);
  }

  throw new Error('Failed to update book: Unknown error');
}
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deleted = await this.bookRepository.delete(id);
      if (!deleted) {
        throw new NotFoundException(`Book with ID "${id}" not found`);
      }
      return true;
    } catch (error) {
  if (error instanceof NotFoundException) throw error;

  if (error instanceof Error) {
    throw new Error(`Failed to delete book: ${error.message}`);
  }

  throw new Error('Failed to delete book: Unknown error');
}
  }
}