import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Link } from './entity/links.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { LinkDto } from './dto/links.dto';
import * as bcrypt from 'bcrypt';
import { customAlphabet } from 'nanoid';

@Injectable()
export class LinksService {
  
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  async findOne(shorterLinks: string): Promise<Link> {
    return this.linkRepository.findOneBy({ shorterLinks: shorterLinks });
  }

  async getLinks(): Promise<Link[]> {
    const link: Link[] = await this.linkRepository.find();
    return link;
  }

  async findOneByShortLink(shortLink: string): Promise<Link | undefined> {
    const linkMapping = await this.linkRepository.findOne({
      where: {
        shorterLinks: Like(`%${shortLink}%`),
      },
    });
  
    return linkMapping;
  }

  async create(linkDto: LinkDto): Promise<Link> {
    try {
      const linkInDb = await this.linkRepository.findOne({
        where: { originalLinks: linkDto.originalLinks },
      });

      if (linkInDb) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      const user = this.linkRepository.create(linkDto);
      const mainDirectory = linkDto.originalLinks.split('.com/')[0];
      const subDirectory = linkDto.originalLinks.split('.com/')[1];
      const hash = await bcrypt.hash(subDirectory, 5);
      const shortString = "https://swiftshort.onrender.com/" + hash.substring(0, 8);
      

      user.shorterLinks = shortString;
      user.createAt = new Date();

      return await this.linkRepository.save(user);
    } catch (err) {
      throw err;
    }
  }

  async delete(id: number) {
    return await this.linkRepository.delete(id);
  }
}
