import { IsString, IsNotEmpty } from 'class-validator';

export class AppDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
