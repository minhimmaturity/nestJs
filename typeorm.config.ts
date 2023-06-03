import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import * as dotenv from 'dotenv';

const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.pghost,
  port: parseInt(process.env.pgport),
  username: process.env.pguser,
  password: process.env.pgpassword,
  database: process.env.pgdatabase,
  entities: [User],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
};

export default dbConfig;
