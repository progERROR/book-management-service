import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BookDalService } from './book-dal.service';
import { RedisService } from '../../redis/redis.service';
import { AwsS3Service } from '../../utils/aws-s3.service';
import { ReviewDalService } from './review-dal.service';
import { CreateBookDto, CreateBookParams, UpdateBookDto } from '../types/book.dto';
import { BookModel, FullBookModel } from '../types/book.model';
import { BookSortingArgs } from '../types/book-sorting.args';
import { Review } from '../../dynamodb/schemas/review.schema';
import Book from '../../db/entities/book.entity';

@Injectable()
export class BookService {
  private logger = new Logger(BookService.name);
  constructor(
    private readonly bookDalService: BookDalService,
    private readonly redisService: RedisService,
    private readonly awsS3Service: AwsS3Service,
    private readonly reviewDalService: ReviewDalService,
  ) {}

  public async createBook(bookDto: CreateBookDto): Promise<FullBookModel> {
    try {
      const contentReference = await this.awsS3Service.uploadBookContent(bookDto.content);

      const createBookParams: CreateBookParams = {
        author: bookDto.author,
        title: bookDto.title,
        contentReference
      }
      const book = await this.bookDalService.createBook(createBookParams);
      const fullBook: FullBookModel = {
        ...book,
        content: bookDto.content,
        reviews: []
      }

      await this.redisService.set(fullBook.id, JSON.stringify(fullBook));

      return fullBook;
    } catch (error) {
      this.logger.error('Error while creating the book:', error);
      throw error;
    }
  }

  public async getAllOrFilteredBooks(
    bookSortingArgs: BookSortingArgs
  ): Promise<BookModel[]> {
    return this.bookDalService.getAllOrFilteredBooks(bookSortingArgs);
  }

  public async getBookById(bookId: string): Promise<FullBookModel> {
    try {
      const bookFromCache = await this.redisService.get(bookId);
      if(bookFromCache) return JSON.parse(bookFromCache);

      const book = await this.bookDalService.getBookById(bookId);

      if(!book) throw new NotFoundException(`There is no book under ${bookId} id`)

      const content = await this.awsS3Service.getFileContent(book.contentReference);
      const getReviewsByBookIdResponse = await this.reviewDalService.getReviewsByBookId(bookId);
      const reviews: Review[] = getReviewsByBookIdResponse.map((item => item.toJSON() as Review));
      const fullBook: FullBookModel = {
        ...book,
        content, reviews
      }

      await this.redisService.set(fullBook.id, JSON.stringify(fullBook));

      return fullBook;
    } catch (error) {
      this.logger.error('Error while getting the book:', error);
      throw error;
    }
  }

  public async updateBook(id: string, updateBookDto: UpdateBookDto): Promise<Book | null> {
    return this.bookDalService.updateBook(id, updateBookDto);
  }

  public async deleteBook(id: string): Promise<boolean> {
    return this.bookDalService.deleteBook(id);
  }
}
