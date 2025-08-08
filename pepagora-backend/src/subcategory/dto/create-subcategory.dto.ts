import { IsString, IsMongoId, IsOptional, IsUrl } from 'class-validator';

export class CreateSubcategoryDto {
  @IsString()
  name: string;

  @IsMongoId()
  category: string;

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
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string; // New field for S3 image URL
}
