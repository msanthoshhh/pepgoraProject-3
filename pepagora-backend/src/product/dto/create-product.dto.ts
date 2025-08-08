import { IsString, IsMongoId, IsOptional, IsUrl, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsMongoId()
  subcategory: string;

  
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
  // @IsString()
  imageUrl?: string;
}
