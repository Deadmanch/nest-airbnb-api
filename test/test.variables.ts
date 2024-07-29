import { Types } from 'mongoose';
import { CreateRoomDto } from '../src/room/dto/create-room.dto';
import { UpdateRoomDto } from '../src/room/dto/update-room.dto';
import { CreateScheduleDto } from '../src/schedule/dto/create-schedule.dto';
import { UpdateScheduleDto } from '../src/schedule/dto/update-schedule.dto';
import { Role } from '../src/user/model/role.enum';

export const scheduleId = new Types.ObjectId().toHexString();
export const roomId = new Types.ObjectId().toHexString();
export const roomTestDto: CreateRoomDto = {
	type: 'apartment',
	description: 'test room',
	images: ['image1', 'image2'],
	isSeaView: false,
	numberRoom: '1',
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

export const RegisterUserTestDto = {
	email: 'test@mail.ru',
	password: 'test',
	role: Role.USER,
	name: 'test-name',
	phone: '+79999999999',
};

export const RegisterAdminTestDto = {
	email: 'admin@mail.ru',
	password: 'admin',
	role: Role.ADMIN,
	name: 'admin-name',
	phone: '+79999999993',
};

export const LoginUserTestDto = {
	email: 'test@mail.ru',
	password: 'test',
};

export const LoginAdminTestDto = {
	email: 'admin@mail.ru',
	password: 'admin',
};

export const TestBookingStatsDto = {
	month: 7,
	year: 2024,
};
