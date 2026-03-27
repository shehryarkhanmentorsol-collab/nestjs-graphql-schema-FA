import { Injectable, NotFoundException } from "@nestjs/common";
import { AuthRepository } from "./author.repository";
import { CreateAuthorInput } from "./dto/create-author.input";
import { AuthorDocument } from "./entities/author.entity";

@Injectable()
export class AuthorService{
    constructor(private readonly authRepository: AuthRepository){}


      async create(createAuthorInput: CreateAuthorInput): Promise<AuthorDocument> {
    try {
      return await this.authRepository.create(createAuthorInput);
    } catch (error) {
  if (error instanceof NotFoundException) throw error;

  if (error instanceof Error) {
    throw new Error(`Failed to create author: ${error.message}`);
  }
    throw new Error('Failed to create author: Unknown error');

}
  }

  async findAll(): Promise<AuthorDocument[]> {
    try {
      return await this.authRepository.findAll();
    } catch (error) {
  if (error instanceof NotFoundException) throw error;

  if (error instanceof Error) {
    throw new Error(`Failed to fetch author: ${error.message}`);
  }
  throw new Error('Failed to fetch author: Unknown error');
}
  }
 
  async findOne(id: string): Promise<AuthorDocument> {
    try {
      const author = await this.authRepository.findById(id);
      if (!author) {
        throw new NotFoundException(`Author with ID "${id}" not found`);
      }
      return author;
    } catch (error) {
  if (error instanceof NotFoundException) throw error;

  if (error instanceof Error) {
    throw new Error(`Failed to fetch author: ${error.message}`);
  }

  throw new Error('Failed to fetch author: Unknown error');
}
}
}