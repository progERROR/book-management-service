import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Url {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public title: string;

  @Column()
  public contentReference: string;

  @Column()
  public author: string;
}

export default Url;