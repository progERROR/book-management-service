import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class BookSortingArgs {
  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @Field(() => Int, { defaultValue: 10 })
  take: number;

  @Field({nullable: true})
  author?: string;

  @Field({nullable: true})
  title?: string;

  @Field({nullable: true})
  sortBy?: 'title' | 'author';

  @Field({nullable: true, defaultValue: 'ASC'})
  sortOrder?: 'ASC' | 'DESC';
}