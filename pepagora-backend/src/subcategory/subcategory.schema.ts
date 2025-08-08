import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from '../category/category.schema';

@Schema({ timestamps: true })
export class Subcategory extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Category;

  
  @Prop()
  metaTitle: string;

  @Prop()
  metaKeyword: string;

  @Prop()
  metaDescription: string;

 @Prop()
  imageUrl?: string;
  
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);
