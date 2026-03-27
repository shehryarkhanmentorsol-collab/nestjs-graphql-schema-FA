import { IsOptional, IsString, MaxLength, IsNotEmpty } from 'class-validator';

export class UpdateBookInput {
  // id comes from the resolver arg — validated as a string
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  genre?: string;
}