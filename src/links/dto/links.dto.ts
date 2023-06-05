import { IsNotEmpty } from 'class-validator';

export class LinkDto {
  @IsNotEmpty()
  originalLinks: string;

  @IsNotEmpty()
  shorterLinks: string;

  createdAt: Date
}
