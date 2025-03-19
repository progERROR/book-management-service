import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Book {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  @Index()
  public title: string;

  @Column()
  public contentReference: string;

  @Column()
  @Index()
  public author: string;
}

export default Book;