import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { Os } from '../../os/entity/os.entity';

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

  @ManyToOne(() => Os, (os) => os.link, { onDelete: 'CASCADE' })
  os: Os;

  @ManyToOne(() => User, (user) => user.links, { onDelete: 'CASCADE' })
  user: User;

  @Column({ nullable: true })
  clickCount: number;
}
