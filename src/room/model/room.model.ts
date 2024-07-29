import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoomDocument = HydratedDocument<RoomModel>;

@Schema({ timestamps: true })
export class RoomModel {
	@Prop({ required: true })
	numberRoom: string;

	@Prop({ required: true })
	type: string;

	@Prop()
	description: string;

	@Prop({ type: () => [String], required: true })
	images: string[];

	@Prop()
	isSeaView: boolean;

	@Prop({ default: true })
	isAvailable: boolean;

	@Prop({ default: false })
	isDeleted: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(RoomModel);
