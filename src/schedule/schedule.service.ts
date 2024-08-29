import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ScheduleDocument, ScheduleModel } from './model/schedule.model';
import { Model, Types } from 'mongoose';
import { ScheduleErrors } from './schedule.constant';
import { ICreateSchedule } from './interfaces/create-schedule.interfaces';
import { IUpdateSchedule } from './interfaces/update-schedule.interfaces';
import { RoomDocument, RoomModel } from '../room/model/room.model';
import { RoomErrors } from '../room/room.constants';
import { TelegramService } from '../telegram/telegram.service';
import {
	generateCreateSсheduleMessage,
	generateDeleteSсheduleMessage,
} from '../helpers/generate-message';

@Injectable()
export class ScheduleService {
	constructor(
		@InjectModel(ScheduleModel.name) private readonly scheduleModel: Model<ScheduleDocument>,
		@InjectModel(RoomModel.name) private readonly roomModel: Model<RoomDocument>,
		private readonly telegramService: TelegramService,
	) {}

	async create({ roomId, date }: ICreateSchedule): Promise<ScheduleDocument> {
		const existingRoom = await this.roomModel.findById(roomId).exec();
		if (!existingRoom) {
			throw new HttpException(RoomErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		const existingSchedule = await this.scheduleModel.findOne({ roomId, date }).exec();
		if (existingSchedule) {
			throw new HttpException(ScheduleErrors.ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
		}
		const message = generateCreateSсheduleMessage(existingRoom, date);

		this.telegramService.sendMessage(message);
		return this.scheduleModel.create({ roomId, date });
	}

	async delete(id: string): Promise<ScheduleDocument | null> {
		const existingSchedule = await this.scheduleModel.findById(id).exec();
		if (!existingSchedule) {
			throw new HttpException(ScheduleErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return this.scheduleModel.findByIdAndDelete(id).exec();
	}

	async deleteByRoomId(roomId: string) {
		const existingRoom = await this.roomModel.findById(roomId).exec();
		if (!existingRoom) {
			throw new HttpException(RoomErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return this.scheduleModel.deleteMany({ roomId: new Types.ObjectId(roomId) }).exec();
	}

	async softDelete(id: string): Promise<ScheduleDocument | null> {
		const existingSchedule = await this.scheduleModel.findById(id).exec();
		if (!existingSchedule) {
			throw new HttpException(ScheduleErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		if (existingSchedule.isDeleted) {
			throw new HttpException(ScheduleErrors.ALREADY_DELETED, HttpStatus.BAD_REQUEST);
		}
		const message = generateDeleteSсheduleMessage(existingSchedule);

		this.telegramService.sendMessage(message);
		return this.scheduleModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).exec();
	}

	async getByRoomId(roomId: string): Promise<ScheduleDocument[] | null> {
		const schedules = await this.scheduleModel.find({ roomId: new Types.ObjectId(roomId) }).exec();
		if (schedules.length === 0) {
			throw new HttpException(ScheduleErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return schedules;
	}
	async getById(id: string): Promise<ScheduleDocument> {
		const schedule = await this.scheduleModel.findById(id).exec();
		if (!schedule) {
			throw new HttpException(ScheduleErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return schedule;
	}
	async getAll(page: number = 1, limit: number = 10): Promise<ScheduleDocument[] | null> {
		const schedules = await this.scheduleModel
			.find()
			.skip((page - 1) * limit)
			.limit(limit)
			.exec();
		if (schedules.length === 0) {
			throw new HttpException(ScheduleErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return schedules;
	}

	async getBookingStatsForMonth(
		month: number,
		year: number,
	): Promise<{ roomNumber: string; bookingDays: number }[]> {
		const startDate = new Date(year, month - 1, 1);
		const endDate = new Date(year, month, 0);

		const schedules = await this.scheduleModel
			.aggregate([
				{
					$match: {
						date: {
							$gte: startDate,
							$lt: endDate,
						},
						isDeleted: false,
					},
				},
				{
					$group: {
						_id: '$roomId',
						bookingDays: { $sum: 1 },
					},
				},
				{
					$lookup: {
						from: 'roommodels',
						localField: '_id',
						foreignField: '_id',
						as: 'roomDetails',
					},
				},
				{
					$unwind: '$roomDetails',
				},
				{
					$project: {
						bookingDays: 1,
						numberRoom: '$roomDetails.numberRoom',
						type: '$roomDetails.type',
					},
				},
			])
			.exec();

		if (!schedules || schedules.length === 0) {
			throw new HttpException(ScheduleErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		return schedules;
	}

	async update(id: string, updateSchedule: IUpdateSchedule) {
		const existingSchedule = await this.scheduleModel.findById(id).exec();
		if (!existingSchedule) {
			throw new HttpException(ScheduleErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return this.scheduleModel.findByIdAndUpdate(id, updateSchedule, { new: true }).exec();
	}
}
