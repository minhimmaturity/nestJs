import { IsNotEmpty, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g)
  password: string;
}
