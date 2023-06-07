import { User } from 'src/user/entity/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

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

  @ManyToOne(() => User, user => user.links)
  user: User;

  @Column({ nullable: true })
  clickCount: number

  @Column({nullable: true})
  Address: string
}
