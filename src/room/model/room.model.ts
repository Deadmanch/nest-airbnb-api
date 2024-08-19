import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoomDocument = HydratedDocument<RoomModel>;

@Schema({ timestamps: true })
export class RoomModel {
	@Prop({ required: true, unique: true })
	numberRoom: string;

	@Prop({ required: true })
	type: string;

	@Prop()
	description: string;

	@Prop()
	isSeaView: boolean;

	@Prop({ default: true })
	isAvailable: boolean;

	@Prop({ default: false })
	isDeleted: boolean;

	@Prop({ type: () => [String] })
	images: string[];
}

export const RoomSchema = SchemaFactory.createForClass(RoomModel);
