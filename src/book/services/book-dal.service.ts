import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Book from '../../db/entities/book.entity';
import { Repository } from 'typeorm';
import { BookSortingArgs } from '../types/book-sorting.args';
import { CreateBookParams, UpdateBookDto } from '../types/book.dto';

@Injectable()
export class BookDalService {
  @InjectRepository(Book)
  private readonly bookRepository: Repository<Book>

  public async createBook(bookParams: CreateBookParams): Promise<Book> {
    const book = await this.bookRepository.create(bookParams);
    return this.bookRepository.save(book);
  }

  public async getAllOrFilteredBooks(
    bookSortingArgs: BookSortingArgs
  ): Promise<Book[]> {
    const queryBuilder = this.bookRepository.createQueryBuilder('book');

    if (bookSortingArgs.author) {
      queryBuilder.andWhere('book.author LIKE :author', { author: `%${bookSortingArgs.author}%` });
    }

    if (bookSortingArgs.title) {
      queryBuilder.andWhere('book.title LIKE :title', { title: `%${bookSortingArgs.title}%` });
    }

    if (bookSortingArgs.sortBy) {
      queryBuilder.orderBy(`book.${bookSortingArgs.sortBy}`, bookSortingArgs.sortOrder);
    }

    queryBuilder.skip((bookSortingArgs.page - 1) * bookSortingArgs.take).take(bookSortingArgs.take);

    return queryBuilder.getMany();
  }

  public async getBookById(id: string): Promise<Book | null> {
    return this.bookRepository.findOneBy({id})
  }

  public async updateBook(id: string, updateBookDto: UpdateBookDto): Promise<Book | null> {
    await this.bookRepository.update(id, updateBookDto);
    return this.getBookById(id);
  }

  public async deleteBook(id: string): Promise<boolean> {
    const result = await this.bookRepository.delete(id);
    return result.affected > 0;
  }
}
