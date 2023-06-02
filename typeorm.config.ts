import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';

const dbConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'swiftsoft',
  entities: [User],
  synchronize: true,
};

export default dbConfig;
