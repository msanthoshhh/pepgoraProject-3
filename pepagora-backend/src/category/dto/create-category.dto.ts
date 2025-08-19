import { IsString,IsArray, IsOptional, IsUrl } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  main_cat_name: string;

  @IsOptional()
  @IsString()
  uniqueId?: string;

  @IsOptional()
  @IsString()
  liveUrl?: string;

  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaKeyword?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsUrl({}, { message: 'imageUrl must be a valid URL' })
  imageUrl?: string;  // S3 bucket image URL

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mappedChildren?: string[];
}
