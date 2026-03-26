import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Author, AuthorDocument } from "./entities/author.entity";
import { Model } from "mongoose";
import { CreateAuthorInput } from "./dto/create-author.input";

@Injectable()
export class AuthRepository{
    constructor(
        @InjectModel(Author.name)
        private readonly authorModel: Model<AuthorDocument>,
    ){}

    async create(createAuthorInput: CreateAuthorInput): Promise<AuthorDocument>{
        const author = new this.authorModel(createAuthorInput)
        return author.save();
    }

     async findAll(): Promise<AuthorDocument[]> {
    return this.authorModel.find().exec();
    }
 
    async findById(id: string): Promise<AuthorDocument | null> {
    return this.authorModel.findById(id).exec();
    }
}