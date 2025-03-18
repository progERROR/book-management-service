import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  READER = "reader",
  REVIEWER = "reviewer",
  AUTHOR = "author",
}

@Entity()
class Url {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: "enum",
    enum: UserRole,
  })
  public role: string;

  @Column()
  public username: string;

}

export default Url;