import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Os } from './os.entity';
import { User } from 'src/user/entity/user.entity';


@Entity({ name: 'link' })
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  shorterLinks: string;

  @Column()
  createAt: Date;

  @ManyToOne(() => Os, (os) => os.link)
  os: Os;

  @ManyToOne(() => User, (user) => user.links, { onDelete: 'CASCADE' })
  user: User;

  @Column({ nullable: true })
  clickCount: number;

  @Column({ nullable: true })
  qrCode: string;
}
