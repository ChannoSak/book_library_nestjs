/* eslint-disable prettier/prettier */
import { User } from './../../auth/schema/user.schema';
/* eslint-disable prettier/prettier */
import { IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Category } from '../schemas/book.schema';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;
  @IsNotEmpty()
  @IsString()
  readonly description: string;
  @IsNotEmpty()
  @IsString()
  readonly author: string;
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;
  @IsNotEmpty()
  @IsEnum(Category, {message:"Please enter correct category"})
  readonly category: Category;
  @IsEmpty({message:'You cannot pass user id'})
  readonly  user:User
}
