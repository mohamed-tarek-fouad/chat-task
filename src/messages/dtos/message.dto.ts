import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class MessageDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  message: string;
}
