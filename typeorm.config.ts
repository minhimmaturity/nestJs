import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';

const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'ep-orange-brook-551938.us-east-2.aws.neon.tech',
  port: 5432,
  username: 'minhimmaturity',
  password: '0TDtXa6uBLnE',
  database: 'swiftshort',
  entities: [User],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
};

export default dbConfig;
