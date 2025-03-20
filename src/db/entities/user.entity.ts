import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  READER = "reader",
  REVIEWER = "reviewer",
  AUTHOR = "author",
}

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: "enum",
    enum: UserRole,
  })
  public role: string;

  @Column()
  password: string;

  @Column()
  public username: string;

}

export default User;