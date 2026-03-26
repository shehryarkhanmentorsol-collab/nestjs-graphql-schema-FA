
import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateAuthorInput {
  @Field(() => String, { description: 'Author full name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @Field(() => String, { nullable: true, description: 'Optional biography' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}