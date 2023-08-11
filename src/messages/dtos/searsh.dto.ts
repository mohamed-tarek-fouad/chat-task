import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SearshDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  searshString: string;
}
