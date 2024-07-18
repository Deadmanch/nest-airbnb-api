import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { RoomModel } from 'src/room/model/room.model';

export type ScheduleDocument = HydratedDocument<ScheduleModel>;

@Schema({ timestamps: true })
export class ScheduleModel {
	@Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: RoomModel.name })
	roomId: string;
	@Prop({ required: true, type: Date })
	date: Date;
	@Prop({ default: false })
	isDeleted: boolean;
}

export const ScheduleSchema = SchemaFactory.createForClass(ScheduleModel);
