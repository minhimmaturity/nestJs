import { IsNotEmpty } from 'class-validator';
import { Role } from './enum/role.enum';

export class CreateUserDTO {
  @IsNotEmpty() name: string;
  @IsNotEmpty() password: string;
  @IsNotEmpty() role: Role;
}
