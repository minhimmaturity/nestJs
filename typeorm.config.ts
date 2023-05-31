import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/UserEntity';

const dbConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'test1',
  entities: [UserEntity],
  synchronize: true,
};

export default dbConfig;