import { IsNotEmpty } from 'class-validator';

export class LinkDto {
  @IsNotEmpty()
  originalLinks: string;

  shorterLinks: string;

  createdAt: Date
}
