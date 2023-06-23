import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Os } from './entity/os.entity';

@Injectable()
export class OsService {
    constructor(
        @InjectRepository(Os)
        private readonly OsRepository: Repository<Os>,
    ) {}

    
}
