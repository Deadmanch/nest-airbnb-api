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
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomErrors } from './room.constants';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../user/model/role.enum';
import { IdValidationPipe } from '../pipes/id-validation.pipe';

@Controller('room')
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

	@UsePipes(new ValidationPipe())
	@Roles(Role.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Post('create')
	async create(@Body() dto: CreateRoomDto) {
		return await this.roomService.create(dto);
	}

	@Roles(Role.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Delete(':id')
	async softDelete(@Param('id') id: string) {
		const deletedRoom = await this.roomService.softDelete(id);
		if (!deletedRoom) {
			throw new HttpException(RoomErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return deletedRoom;
	}

	@Roles(Role.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Delete('hardDelete/:id')
	async delete(@Param('id', IdValidationPipe) id: string) {
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
	async getById(@Param('id', IdValidationPipe) id: string) {
		const room = await this.roomService.getById(id);
		if (!room) {
			throw new HttpException(RoomErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		return room;
	}

	@UsePipes(new ValidationPipe())
	@Roles(Role.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Patch(':id')
	async update(@Param('id', IdValidationPipe) id: string, @Body() dto: UpdateRoomDto) {
		const updatedRoom = await this.roomService.update(id, dto);
		if (!updatedRoom) {
			throw new HttpException(RoomErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		return updatedRoom;
	}
}
