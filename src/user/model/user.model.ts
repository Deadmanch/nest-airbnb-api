import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserModel>;

@Schema({ timestamps: true, _id: true })
export class UserModel {
	@Prop()
	name: string;
	@Prop({ unique: true, required: true })
	email: string;
	@Prop({ required: true })
	passwordHash: string;
	@Prop({ required: true })
	role: string;
	@Prop()
	isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
