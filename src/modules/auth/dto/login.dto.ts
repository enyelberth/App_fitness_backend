import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ description: "Email or username" })
  @IsString()
  @MinLength(3)
  @MaxLength(254)
  identifier!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  password!: string;
}
