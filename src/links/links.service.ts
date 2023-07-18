import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Req,
  forwardRef,
} from '@nestjs/common';
import { Link } from './entity/links.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions, Equal } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { Os } from '../os/entity/os.entity';
import { createLinkDto } from './dto/createLink.dto';
import { OsEnum } from 'src/os/enum/os.enum';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
    @InjectRepository(Os)
    private readonly OsRepository: Repository<Os>,
    @Inject(forwardRef(() => UserService))
    private readonly UserService: UserService,
  ) {}

  async getDetailsLink(id: number): Promise<Link> {
    return this.linkRepository.findOne({
      where: { id: id },
      relations: ['os', 'user'],
    });
  }

  async getLinks(email: string): Promise<Link[]> {
    const links: Link[] = await this.linkRepository.find({
      relations: ['os', 'user'],
      where: { user: { email: email } },
    });
    return links;
  }

  async findOneByShortLink(shortLink: string): Promise<Link[] | undefined> {
    const linkMappings: Link[] = await this.linkRepository.find({
      relations: ['os'],
      where: {
        shorterLinks: Like(`%${shortLink}%`),
      },
    });

    return linkMappings;
  }

  async create(email: string, createLinkDto: createLinkDto) {
    try {
      const userInDb = await this.UserService.findOne(email);
      if (!userInDb) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
  
      const osNames = createLinkDto.name.split(',').map((name) => name.trim());
      const multipleLinks = createLinkDto.originalLinks.split(',');
  
      const linkDataObject = {};
  
      const domain = multipleLinks[0].match(
        /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/,
      )[1];
  
      const subDirectory = multipleLinks[0].split(domain)[1].slice(1);
      const hash = await bcrypt.hash(subDirectory, 5);
      const shortString = process.env.baseUrl + hash.substring(0, 8);
  
      for (const osName of osNames) {
        if (Object.values(OsEnum).includes(osName as OsEnum)) {
          const link = this.linkRepository.create();
          link.originalLinks = createLinkDto.originalLinks;
          link.shorterLinks = shortString;
          link.createAt = new Date();
          link.clickCount = 0;
          link.user = userInDb;
  
          const os = this.OsRepository.create();
          os.destination_url = createLinkDto.originalLinks;
          os.name = osName as OsEnum;
  
          link.os = os;
  
          linkDataObject[osName] = { link, os }; // Store both link and os in linkDataObject using the osName as the key
        } else {
          throw new Error(`Invalid operating system name: ${osName}`);
        }
      }
  
      // Save link and os data from the object into the database
      for (const osName in linkDataObject) {
        if (linkDataObject.hasOwnProperty(osName)) {
          const { link, os } = linkDataObject[osName];
          await this.linkRepository.save(link);
          await this.OsRepository.save(os);
        }
      }
  
      return Object.values(linkDataObject);
    } catch (err) {
      console.log(err);
      console.log(err.cause);
    }
  }
  
  
  async updateCount(id: number) {
    const linkInDb = await this.linkRepository.findOne({ where: { id: id } });
    linkInDb.clickCount++;
    return await this.linkRepository.update(id, linkInDb);
  }

  async delete(id: number) {
    return await this.linkRepository.delete(id);
  }

  async takeDestinationUrl(id: number) {
    return await this.OsRepository.findOne({
      where: {
        id: id,
      },
    });
  }
}
