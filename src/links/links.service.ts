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
import { LinkDto } from './dto/links.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { Package } from 'src/user/enum/type.enum';
import { Os } from '../os/entity/os.entity';
import { OsDto } from '../os/dto/os.dto';

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
    return this.linkRepository.findOne({where: {id: id}, relations:['os']})
  }

  async findOne(shorterLinks: string): Promise<Link> {
    return this.linkRepository.findOneBy({ shorterLinks: shorterLinks });
  }

  async getLinks(email: string): Promise<Link[]> {
    const links: Link[] = await this.linkRepository.find({
      relations: ['os', 'user'],
      where: { user: { email: email } },
    });
    return links;
  }

  async findOneByShortLink(shortLink: string): Promise<Link | undefined> {
    const linkMapping = await this.linkRepository.findOne({
      relations: ['os'],
      where: {
        shorterLinks: Like(`%${shortLink}%`),
      },
    });

    return linkMapping;
  }

  async create(email: string, linkDto: LinkDto, OsDto: OsDto): Promise<Link> {
    try {
      const linkInDb = await this.linkRepository.findOne({
        where: { originalLinks: linkDto.originalLinks },
      });

      const userInDb = await this.UserService.findOne(email);
      if (!userInDb) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      const options: FindManyOptions<Link> = {
        where: {
          user: { id: Equal(userInDb.id) }, // Use Equal operator to compare IDs
        },
      };

      const linkByUser = await this.linkRepository.find(options);
      if (userInDb.package != Package.Free) {
        const links = this.linkRepository.create(linkDto);
        const os = this.OsRepository.create();

        const domain = linkDto.originalLinks.match(
          /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/,
        )[1];

        const subDirectory = linkDto.originalLinks.split(domain)[1].slice(1);
        console.log(subDirectory);
        const hash = await bcrypt.hash(subDirectory, 5);
        const shortString = process.env.baseUrl + hash.substring(0, 8);

        os.destination_url = linkDto.originalLinks;
        os.name = OsDto.name;
        await this.OsRepository.save(os);

        console.log(os);

        links.shorterLinks = shortString;
        links.createAt = new Date();
        links.clickCount = 0;
        links.user = userInDb;
        links.os = os;
        await this.linkRepository.save(links);

        return links;
      } else {
        if (linkByUser.length <= 10) {
          const links = this.linkRepository.create(linkDto);

          const domain = linkDto.originalLinks.match(
            /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/,
          )[1];

          const subDirectory = linkDto.originalLinks.split(domain)[1].slice(1);
          console.log(subDirectory);
          const hash = await bcrypt.hash(subDirectory, 5);
          const shortString = process.env.baseUrl + hash.substring(0, 8);

          links.shorterLinks = shortString;
          links.createAt = new Date();
          links.clickCount = 0;
          links.user = userInDb;

          return await this.linkRepository.save(links);
        } else {
          throw new HttpException(
            'Free account only can create 10 links',
            HttpStatus.FORBIDDEN,
          );
        }
      }
    } catch (err) {
      console.log(err);
      console.log(err.cause);
    }
  }

  async updateCount(id: number) {
    const linkInDb = await this.linkRepository.findOne({where: {id: id}});
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
