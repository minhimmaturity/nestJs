import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Link } from '../../links/entity/links.entity';

@Entity({ name: 'os' })
export class Os {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  destination_url: string;

  @OneToMany(() => Link, (link) => link.os)
  link: Link[];
}
