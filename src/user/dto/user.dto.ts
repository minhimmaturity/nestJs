import { IsNotEmpty, Matches, IsEmail } from 'class-validator';
import { Role } from '../enum/role.enum';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g)
  password: string;

  roles: Role;
}
