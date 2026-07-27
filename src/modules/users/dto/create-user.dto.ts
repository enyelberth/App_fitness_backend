import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { FitnessGoal, Gender, UserLevel } from "@prisma/client";
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ArrayMaxSize,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @ApiProperty({ example: "fitness_user" })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_]+$/)
  username!: string;

  @ApiProperty({ minLength: 10 })
  @IsString()
  @MinLength(10)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
    message: "password must include upper, lower, number and symbol",
  })
  password!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  lastName?: string;

  @ApiPropertyOptional({ minimum: 13, maximum: 120 })
  @IsOptional()
  @IsInt()
  @Min(13)
  @Max(120)
  age?: number;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ enum: UserLevel })
  @IsOptional()
  @IsEnum(UserLevel)
  level?: UserLevel;

  @ApiPropertyOptional({ enum: FitnessGoal })
  @IsOptional()
  @IsEnum(FitnessGoal)
  goal?: FitnessGoal;

  @ApiPropertyOptional({ minimum: 20, maximum: 500 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(20)
  @Max(500)
  weightKg?: number;

  @ApiPropertyOptional({ minimum: 80, maximum: 260 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(80)
  @Max(260)
  heightCm?: number;

  @ApiPropertyOptional({ minimum: 10, maximum: 10_080 })
  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(10_080)
  availableMinutes?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(80, { each: true })
  availableEquipment?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  @MaxLength(200, { each: true })
  injuries?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  preferences?: string[];
}
