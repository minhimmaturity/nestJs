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
  Headers,
  Head,
  Req,
} from '@nestjs/common';
import { LinksService } from '../links/links.service';
import { LinkDto } from './dto/links.dto';
import { OsDto } from '../os/dto/os.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('links')
export class LinksController {
  constructor(private readonly LinksService: LinksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async create(@Req() req, @Body() linkDto: LinkDto,@Body() OsDto: OsDto) {
    const { email } = req.user;
    try {
      if (await this.LinksService.create(email, linkDto, OsDto)) {
        return {
          link: linkDto.originalLinks
        };
      } else {
        throw new HttpException('add failed', HttpStatus.EXPECTATION_FAILED);
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('/details/:id')
  async getDetails(@Param('id') id: number) {
    return await this.LinksService.getDetailsLink(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllLink(@Req() req) {
    const {email} = req.user
    return await this.LinksService.getLinks(email);
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
    console.log(shortLink)
    const linkMapping = await this.LinksService.findOneByShortLink(shortLink);
    const osInDb = await this.LinksService.takeDestinationUrl(
      linkMapping.os.id,
    );

    await this.LinksService.updateCount(linkMapping.id);
    if (!linkMapping) {
      throw new HttpException('Short link not found', HttpStatus.NOT_FOUND);
    }

    return { url: osInDb.destination_url };
  }
}
