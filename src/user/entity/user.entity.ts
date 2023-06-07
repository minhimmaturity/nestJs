import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Role } from '../enum/role.enum';
import { Package } from '../enum/type.enum';
import { Link } from 'src/links/entity/links.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;
  /**
   * 1: Admin, 2: User
   */
  @Column()
  roles: Role;

  @Column({nullable:true})
  package: Package;

  @OneToMany((type) => Link, (link) => link.user)
    links: Link[]
}
