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

	async create(data: ICreateRoom): Promise<RoomDocument> {
		const existingRoom = await this.roomModel.findOne({ numberRoom: data.numberRoom });
		if (existingRoom) {
			throw new HttpException(RoomErrors.ALREADY_EXISTS_NUMBER_ROOM, HttpStatus.BAD_REQUEST);
		}
		return await this.roomModel.create(data);
	}

	async delete(id: string): Promise<RoomDocument | null> {
		const existingRoom = await this.roomModel.findById(id).exec();
		if (!existingRoom) {
			throw new HttpException(RoomErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return this.roomModel.findByIdAndDelete(id).exec();
	}

	async softDelete(id: string): Promise<RoomDocument | null> {
		const existingRoom = await this.roomModel.findById(id).exec();
		if (!existingRoom) {
			throw new HttpException(RoomErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return this.roomModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).exec();
	}

	async getById(id: string): Promise<RoomDocument | null> {
		const existingRoom = await this.roomModel.findById(id).exec();
		if (!existingRoom) {
			throw new HttpException(RoomErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return this.roomModel.findById(id).exec();
	}

	async getAll(page: number = 1, limit: number = 10): Promise<RoomDocument[] | null> {
		const rooms = await this.roomModel
			.find()
			.skip((page - 1) * limit)
			.limit(limit)
			.exec();

		if (rooms.length === 0) {
			throw new HttpException(RoomErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return rooms;
	}

	async update(id: string, data: IUpdateRoom) {
		const room = await this.roomModel.findById(id);
		if (!room) {
			throw new HttpException(RoomErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		if (data.images && data.images.length > 0) {
			room.images = data.images;
		}
		return await this.roomModel.findByIdAndUpdate(id, room, { new: true }).exec();
	}
}
