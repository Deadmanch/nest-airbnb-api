import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RoomDocument, RoomModel } from './model/room.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICreateRoom } from './interfaces/create-room.interfaces';
import { IUpdateRoom } from './interfaces/update-room.interfaces';
import { RoomErrors } from './room.constants';

@Injectable()
export class RoomService {
	constructor(@InjectModel(RoomModel.name) private readonly roomModel: Model<RoomDocument>) {}

	async create(data: ICreateRoom) {
		const existingRoom = await this.roomModel.findOne({ numberRoom: data.numberRoom });
		if (existingRoom) {
			throw new HttpException(RoomErrors.ALREADY_EXISTS_NUMBER_ROOM, HttpStatus.BAD_REQUEST);
		}
		return await this.roomModel.create(data);
	}

	async delete(id: string): Promise<RoomDocument | null> {
		return this.roomModel.findByIdAndDelete(id).exec();
	}

	async softDelete(id: string): Promise<RoomDocument | null> {
		return this.roomModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).exec();
	}

	async getById(id: string): Promise<RoomDocument | null> {
		return this.roomModel.findById(id).exec();
	}

	async getAll(page: number = 1, limit: number = 10): Promise<RoomDocument[] | null> {
		const rooms = await this.roomModel
			.find()
			.skip((page - 1) * limit)
			.limit(limit)
			.exec();

		return rooms.length > 0 ? rooms : null;
	}

	async update(id: string, data: IUpdateRoom) {
		return this.roomModel.findByIdAndUpdate(id, data, { new: true }).exec();
	}
}
