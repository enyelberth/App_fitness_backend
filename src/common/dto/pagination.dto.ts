import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min, IsOptional, Type } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number = 20;

  get pageSize(): number {
    return this.take || 20;
  }
}
