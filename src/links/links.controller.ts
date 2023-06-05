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
  Redirect
} from '@nestjs/common';
import { LinksService } from '../links/links.service';
import { LinkDto } from './dto/links.dto';

@Controller('links')
export class LinksController {
  constructor(private readonly LinksService: LinksService) {}

  @Post()
  async create(@Body() linkDto: LinkDto) {
    try {
      if (await this.LinksService.create(linkDto)) {
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
    @Param('shortLink') shortLink: string,
  ): Promise<{ url: string }> {
    const linkMapping = await this.LinksService.findOneByShortLink(shortLink);
    if (!linkMapping) {
      throw new HttpException('Short link not found', HttpStatus.NOT_FOUND);
    }

    return { url: linkMapping.originalLinks };
  }
}


