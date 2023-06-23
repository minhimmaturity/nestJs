import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Link } from 'src/links/entity/links.entity';
import { Os } from 'src/os/entity/os.entity';

const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'ep-orange-brook-551938.us-east-2.aws.neon.tech',
  port: 5432,
  username: 'minhimmaturity',
  password: '0TDtXa6uBLnE',
  database: 'swiftshort',
  entities: [User, Link, Os],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
};

export default dbConfig;
