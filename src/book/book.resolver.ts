import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BookModel, FullBookModel } from './types/book.model';
import { CreateBookDto, UpdateBookDto } from './types/book.dto';
import { BookService } from './services/book.service';
import { BookSortingArgs } from './types/book-sorting.args';

@Resolver(() => BookModel)
export class BookResolver {
  constructor( private readonly bookService: BookService) {}

  @Mutation(() => FullBookModel)
  public async createBook(@Args('data') data: CreateBookDto) {
    return this.bookService.createBook(data);
  }

  @Query(() => [BookModel])
  public async getAllOrFilteredBooks(@Args() bookSortingArgs: BookSortingArgs) {
    return this.bookService.getAllOrFilteredBooks(bookSortingArgs);
  }

  @Query(() => FullBookModel)
  public async getBookById(@Args('id') id: string) {
    return this.bookService.getBookById(id);
  }

  // The logic below is not included in application design
  // So the basic logic presents only for CRUD to be completed

  @Mutation(() => BookModel)
  async updateBook(@Args('id') id: string, @Args('data') data: UpdateBookDto) {
    return this.bookService.updateBook(id, data);
  }

  @Mutation(() => Boolean)
  async deleteBook(@Args('id') id: string) {
    return this.bookService.deleteBook(id);
  }
}