import { HttpException, HttpStatus, Inject, Injectable, Req, forwardRef } from '@nestjs/common';
import { Link } from './entity/links.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { LinkDto } from './dto/links.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class LinksService {
  
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
    @Inject(forwardRef(() => UserService))
    private readonly UserService: UserService,
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

  async create(email: string, linkDto: LinkDto): Promise<Link> {
    try {
      const linkInDb = await this.linkRepository.findOne({
        where: { originalLinks: linkDto.originalLinks },
      });

      const userInDb = await this.UserService.findOne(email);
      if(!userInDb) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      if (linkInDb) {
        throw new HttpException('Link already exists', HttpStatus.BAD_REQUEST);
      }

      const user = this.linkRepository.create(linkDto);

      const domain = linkDto.originalLinks.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/)[1];

      const subDirectory = linkDto.originalLinks.split(domain)[1].slice(1);
      console.log(subDirectory)
      const hash = await bcrypt.hash(subDirectory, 5);
      const shortString = process.env.baseUrl + hash.substring(0, 8);
      
      user.shorterLinks = shortString;
      user.createAt = new Date();
      user.clickCount = 0;
      user.user = userInDb;

      return await this.linkRepository.save(user);
    } catch (err) {
      console.log(err);
      console.log(err.cause);
    }
  }

  async delete(id: number) {
    return await this.linkRepository.delete(id);
  }
}
