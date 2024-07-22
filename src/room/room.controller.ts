import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomErrors } from './room.constants';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('room')
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

	@Post('create')
	async create(@Body() dto: CreateRoomDto) {
		return await this.roomService.create(dto);
	}

	@Delete(':id')
	async softDelete(@Param('id') id: string) {
		const deletedRoom = await this.roomService.softDelete(id);
		if (!deletedRoom) {
			throw new HttpException(RoomErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return deletedRoom;
	}

	@Delete('hardDelete/:id')
	async delete(@Param('id') id: string) {
		const deletedRoom = await this.roomService.delete(id);
		if (!deletedRoom) {
			throw new HttpException(RoomErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}
	@Get('getAll')
	async getAll(@Query('page') page: number, @Query('limit') limit: number) {
		const rooms = await this.roomService.getAll(page, limit);
		if (!rooms) {
			throw new HttpException(RoomErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return rooms;
	}

	@Get(':id')
	async getById(@Param('id') id: string) {
		const room = await this.roomService.getById(id);
		if (!room) {
			throw new HttpException(RoomErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		return room;
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: UpdateRoomDto) {
		const updatedRoom = await this.roomService.update(id, dto);
		if (!updatedRoom) {
			throw new HttpException(RoomErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		return updatedRoom;
	}
}
