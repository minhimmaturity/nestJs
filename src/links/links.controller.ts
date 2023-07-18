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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { createLinkDto } from './dto/createLink.dto';
import { userAgent } from 'next/server';

@Controller('links')
export class LinksController {
  constructor(private readonly LinksService: LinksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async create(@Req() req, @Body() createLinkDto: createLinkDto) {
    const { email } = req.user;
    try {
      if (await this.LinksService.create(email, createLinkDto)) {
        return {
          link: createLinkDto.originalLinks
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
    @Headers('user-agent') userAgent: string 
  ): Promise<{ url: string }> {
    const linkMapping = await this.LinksService.findOneByShortLink(shortLink);
    for(let i = 0; i < linkMapping.length; i++) {
      if(linkMapping[i].os.name === userAgent) {
        return { url: linkMapping[i].os.destination_url };
      }
    }

  }
}
