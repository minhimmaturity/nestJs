import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'link' })
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalLinks: string;

  @Column()
  shorterLinks: string;

  @Column()
  createAt: Date;
}
