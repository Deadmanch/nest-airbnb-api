import { Types } from 'mongoose';
import { CreateRoomDto } from '../src/room/dto/create-room.dto';
import { UpdateRoomDto } from '../src/room/dto/update-room.dto';
import { CreateScheduleDto } from '../src/schedule/dto/create-schedule.dto';
import { UpdateScheduleDto } from '../src/schedule/dto/update-schedule.dto';

export const scheduleId = new Types.ObjectId().toHexString();
export const roomId = new Types.ObjectId().toHexString();
export const roomTestDto: CreateRoomDto = {
	type: 'apartment',
	description: 'test room',
	images: ['image1', 'image2'],
	isSeaView: false,
};
export const updateRoomDto: UpdateRoomDto = {
	type: 'test room',
	description: 'test apartment room',
	isSeaView: true,
};

export const scheduleTestDto: CreateScheduleDto = {
	roomId,
	date: '2024-07-29',
};

export const updateScheduleDto: UpdateScheduleDto = {
	date: '2024-07-30',
};
