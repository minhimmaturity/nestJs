import { IsNotEmpty } from 'class-validator';
import { OsEnum } from '../enum/os.enum';

export class OsDto {
  name: OsEnum;
  destination_url: string;


}
