import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true, unique: true })
  main_cat_name: string;

  @Prop()
  uniqueId?:string;
  @Prop()
  liveUrl?:string;

  @Prop()
  metaTitle?: string;

  @Prop()
  metaKeyword?: string;

  @Prop()
  metaDescription?: string;

 @Prop()
  imageUrl?: string;
  @Prop({ type: [Types.ObjectId], ref: 'SubCategory', default: [] })
  mappedChildren?: Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
