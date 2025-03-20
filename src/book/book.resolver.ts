import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BookModel, FullBookModel } from './types/book.model';
import { CreateBookDto, UpdateBookDto } from './types/book.dto';
import { BookService } from './services/book.service';
import { BookSortingArgs } from './types/book-sorting.args';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { UserRole } from '../db/entities/user.entity';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => BookModel)
export class BookResolver {
  constructor( private readonly bookService: BookService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Role(UserRole.AUTHOR)
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

  @Mutation(() => String)
  async deleteBook(@Args('id') id: string) {
    await this.bookService.deleteBook(id);
    return 'Book was deleted'
  }
}