import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'user'})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
  @Column()
  password: string;
  /**
   * 1: Admin, 2: User
   */
  @Column()
  role: number;
}
