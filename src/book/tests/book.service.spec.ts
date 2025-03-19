import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from '../services/book.service';
import { BookDalService } from '../services/book-dal.service';
import { RedisService } from '../../redis/redis.service';
import { AwsS3Service } from '../../utils/aws-s3.service';
import { ReviewDalService } from '../services/review-dal.service';
import { NotFoundException } from '@nestjs/common';
import { CreateBookDto } from '../types/book.dto';
import { BookModel, FullBookModel } from '../types/book.model';
import { BookSortingArgs } from '../types/book-sorting.args';
import { Review } from '../../dynamodb/schemas/review.schema';

describe('BookService', () => {
  let bookService: BookService;
  let createBook: jest.Mock;
  let getAllOrFilteredBooks: jest.Mock;
  let getBookById: jest.Mock;
  let set: jest.Mock;
  let get: jest.Mock;
  let uploadBookContent: jest.Mock;
  let getFileContent: jest.Mock;
  let getReviewsByBookId: jest.Mock;

  beforeEach(async () => {
    createBook = jest.fn();
    getAllOrFilteredBooks = jest.fn();
    getBookById = jest.fn();
    set = jest.fn();
    get = jest.fn();
    uploadBookContent = jest.fn();
    getFileContent = jest.fn();
    getReviewsByBookId = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: BookDalService,
          useValue: {
            createBook,
            getAllOrFilteredBooks,
            getBookById,
          },
        },
        {
          provide: RedisService,
          useValue: {
            set,
            get,
          },
        },
        {
          provide: AwsS3Service,
          useValue: {
            uploadBookContent,
            getFileContent,
          },
        },
        {
          provide: ReviewDalService,
          useValue: {
            getReviewsByBookId,
          },
        },
      ],
    }).compile();

    bookService = module.get(BookService);
  });

  describe('createBook', () => {
    it('should create a book and store it in Redis', async () => {
      const bookDto: CreateBookDto = {
        author: 'John Doe',
        title: 'Test Book',
        content: 'Book Content',
      };

      const uploadedContentRef = '123.txt';
      const createdBook: BookModel = {
        id: '1',
        author: bookDto.author,
        title: bookDto.title,
        contentReference: uploadedContentRef,
      };

      uploadBookContent.mockResolvedValue(uploadedContentRef);
      createBook.mockResolvedValue(createdBook);
      set.mockResolvedValue(null);

      const result = await bookService.createBook(bookDto);

      expect(uploadBookContent).toHaveBeenCalledWith(bookDto.content);
      expect(createBook).toHaveBeenCalledWith({
        author: bookDto.author,
        title: bookDto.title,
        contentReference: uploadedContentRef,
      });
      expect(set).toHaveBeenCalledWith(result.id, JSON.stringify(result));

      expect(result).toEqual({
        ...createdBook,
        content: bookDto.content,
        reviews: [],
      });
    });
  });

  describe('getAllOrFilteredBooks', () => {
    it('should return filtered books', async () => {
      const sortingArgs: BookSortingArgs = { page: 1, take: 10, sortBy: 'title', sortOrder : 'ASC' };
      const books: BookModel[] = [
        { id: '1', author: 'John', title: 'A', contentReference: '123.txt' },
        { id: '2', author: 'Jane', title: 'B', contentReference: '124.txt' },
      ];

      getAllOrFilteredBooks.mockResolvedValue(books);

      const result = await bookService.getAllOrFilteredBooks(sortingArgs);
      expect(getAllOrFilteredBooks).toHaveBeenCalledWith(sortingArgs);
      expect(result).toEqual(books);
    });
  });

  describe('getBookById', () => {
    it('should return a full book from Redis if cached', async () => {
      const bookId = '1';
      const cachedBook: FullBookModel = {
        id: bookId,
        author: 'John Doe',
        title: 'Test Book',
        content: 'Book Content',
        reviews: [],
        contentReference: 's3://uploaded-content-ref',
      };

      get.mockResolvedValue(JSON.stringify(cachedBook));

      const result = await bookService.getBookById(bookId);

      expect(get).toHaveBeenCalledWith(bookId);
      expect(result).toEqual(cachedBook);
    });

    it('should return a full book from DB if not cached', async () => {
      const bookId = '1';
      const dbBook: BookModel = {
        id: bookId,
        author: 'John Doe',
        title: 'Test Book',
        contentReference: 's3://uploaded-content-ref',
      };

      const bookContent = 'Book Content from S3';
      const reviews: Review[] = [{ id: 'r1', bookId: '1', userName: 'John Doe', content: 'Great!' }];

      get.mockResolvedValue(null);
      getBookById.mockResolvedValue(dbBook);
      getFileContent.mockResolvedValue(bookContent);
      getReviewsByBookId.mockResolvedValue([
        { toJSON: () => reviews[0] } as any,
      ]);

      const result = await bookService.getBookById(bookId);

      expect(get).toHaveBeenCalledWith(bookId);
      expect(getBookById).toHaveBeenCalledWith(bookId);
      expect(getFileContent).toHaveBeenCalledWith(dbBook.contentReference);
      expect(getReviewsByBookId).toHaveBeenCalledWith(bookId);
      expect(set).toHaveBeenCalledWith(bookId, JSON.stringify(result));

      expect(result).toEqual({
        ...dbBook,
        content: bookContent,
        reviews,
      });
    });

    it('should throw NotFoundException if book does not exist', async () => {
      const bookId = '999';
      get.mockResolvedValue(null);
      getBookById.mockResolvedValue(null);

      await expect(bookService.getBookById(bookId)).rejects.toThrow(
        new NotFoundException(`There is no book under ${bookId} id`),
      );

      expect(getBookById).toHaveBeenCalledWith(bookId);
    });

    it('should log an error and throw if an exception occurs', async () => {
      const bookId = '1';
      get.mockRejectedValue(new Error('Redis failure'));

      await expect(bookService.getBookById(bookId)).rejects.toThrow(Error);
    });
  });
});
