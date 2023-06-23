import { IsNotEmpty } from 'class-validator';

export class OsDto {
  @IsNotEmpty()
  name: string;

  destination_url: string;

}
