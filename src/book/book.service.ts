/* eslint-disable prettier/prettier */
import { User } from './../auth/schema/user.schema';
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as mongoose from 'mongoose';
import { Book } from './schemas/book.schema';
import { Query } from 'express-serve-static-core';
@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  async findAll(query: Query): Promise<Book[]> {
    const resPerPage = 2
    const currentPage = Number(query.page) || 1
    const skip = resPerPage * (currentPage -1)
    const keyword = query.keyword ? {
      title:{
        $regex: query.keyword,
        $options: 'i'
      }
    }:{}
    const books = await this.bookModel.find({...keyword}).limit(resPerPage).skip(skip).populate('user');
    return books;
  }

  async create(book: Book, user:User): Promise<Book> {
    const check =  await this.bookModel.findOne({title: book.title})
    if(check){
      throw new BadRequestException('This book already exist in system!')
    }
    const data = Object.assign(book, {user:user._id})
    const res = await this.bookModel.create(data);
    return res;
  }

  async findById(id: string): Promise<Book> {
    const isValidId = mongoose.isValidObjectId(id)
    if(!isValidId){
      throw new BadRequestException('Please enter correct id')
    }
    const book = await this.bookModel.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found.');
    }

    return book;
  }

  async updateById(id: string, book: Book): Promise<Book> {
    return await this.bookModel.findByIdAndUpdate(id, book, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<Book> {
    return await this.bookModel.findByIdAndDelete(id);
  }
}
