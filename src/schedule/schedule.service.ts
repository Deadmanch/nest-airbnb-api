import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ScheduleDocument, ScheduleModel } from './model/schedule.model';
import { Model, Types } from 'mongoose';
import { ScheduleErrors } from './schedule.constant';
import { ICreateSchedule } from './interfaces/create-schedule.interfaces';
import { IUpdateSchedule } from './interfaces/update-schedule.interfaces';

@Injectable()
export class ScheduleService {
	constructor(
		@InjectModel(ScheduleModel.name) private readonly scheduleModel: Model<ScheduleDocument>,
	) {}

	async create({ roomId, date }: ICreateSchedule): Promise<ScheduleDocument> {
		const existingSchedule = await this.scheduleModel.findOne({ roomId, date }).exec();
		if (existingSchedule) {
			throw new HttpException(ScheduleErrors.ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
		}
		return await this.scheduleModel.create({ roomId, date });
	}

	async delete(id: string): Promise<ScheduleDocument | null> {
		return this.scheduleModel.findByIdAndDelete(id).exec();
	}

	async deleteByRoomId(roomId: string) {
		return this.scheduleModel.deleteMany({ roomId: new Types.ObjectId(roomId) }).exec();
	}

	async softDelete(id: string): Promise<ScheduleDocument | null> {
		return this.scheduleModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).exec();
	}

	async getByRoomId(roomId: string): Promise<ScheduleDocument[]> {
		return this.scheduleModel.find({ roomId: new Types.ObjectId(roomId) }).exec();
	}
	async getById(id: string): Promise<ScheduleDocument> {
		const schedule = await this.scheduleModel.findById(id).exec();
		if (!schedule) {
			throw new HttpException(ScheduleErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return schedule;
	}
	async getAll(page: number = 1, limit: number = 10): Promise<ScheduleDocument[]> {
		return this.scheduleModel
			.find()
			.skip((page - 1) * limit)
			.limit(limit)
			.exec();
	}

	async update(id: string, updateSchedule: IUpdateSchedule) {
		return this.scheduleModel.findByIdAndUpdate(id, updateSchedule, { new: true }).exec();
	}
}
