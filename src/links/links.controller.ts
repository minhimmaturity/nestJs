import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  Redirect,
  UseGuards,
  Header,
  Head,
  Req,
} from '@nestjs/common';
import { LinksService } from '../links/links.service';
import { LinkDto } from './dto/links.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import * as useragent from 'useragent';
import { Console } from 'console';

@Controller('links')
export class LinksController {
  constructor(private readonly LinksService: LinksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async create(@Req() req, @Body() linkDto: LinkDto) {
    const { email } = req.user;
    try {
      if (await this.LinksService.create(email, linkDto)) {
        throw new HttpException('add success', HttpStatus.OK);
      } else {
        throw new HttpException('add failed', HttpStatus.EXPECTATION_FAILED);
      }
    } catch (err) {
      throw err;
    }
  }

  @Get()
  async getAllLink() {
    return await this.LinksService.getLinks();
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    if (await this.LinksService.delete(+id)) {
      throw new HttpException('remove success', HttpStatus.OK);
    } else {
      throw new HttpException('remove failed', HttpStatus.NOT_ACCEPTABLE);
    }
  }

  @Get(':shortLink')
  @Redirect('', 301)
  async redirectToLongLink(
    @Req() req,
    @Param('shortLink') shortLink: string,
  ): Promise<{ url: string }> {
    const linkMapping = await this.LinksService.findOneByShortLink(shortLink);
    if (!linkMapping) {
      throw new HttpException('Short link not found', HttpStatus.NOT_FOUND);
    }

    const userAgentString = req.headers['user-agent'];

    if (userAgentString === 'iPhone' || userAgentString === 'iPad') {
      console.log('https://apps.apple.com/us/app/messenger/id454638411');
      return { url: 'https://apps.apple.com/us/app/messenger/id454638411' };
    } else if (userAgentString === 'Android') {
      console.log(
        'https://play.google.com/store/apps/details?id=com.facebook.orca',
      );
      return {
        url: 'https://play.google.com/store/apps/details?id=com.facebook.orca',
      };
    } else {
      console.log(linkMapping.originalLinks);
      return { url: linkMapping.originalLinks };
    }
  }
}
