import { Types } from 'mongoose';

export interface ICreateSchedule {
	roomId: Types.ObjectId;
	date: string;
}
