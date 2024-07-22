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
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleErrors } from './schedule.constant';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Controller('schedule')
export class ScheduleController {
	constructor(private readonly scheduleService: ScheduleService) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateScheduleDto) {
		return await this.scheduleService.create(dto);
	}

	@Delete(':id')
	async softDelete(@Param('id') id: string) {
		const deletedSchedule = await this.scheduleService.softDelete(id);
		if (!deletedSchedule) {
			throw new HttpException(ScheduleErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return deletedSchedule;
	}

	@Delete('hardDelete/:id')
	async delete(@Param('id') id: string) {
		const deletedSchedule = await this.scheduleService.delete(id);
		if (!deletedSchedule) {
			throw new HttpException(ScheduleErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return deletedSchedule;
	}

	@Delete('deleteByRoomId/:roomId')
	async deleteByRoomId(@Param('roomId') roomId: string) {
		const deletedSchedule = await this.scheduleService.deleteByRoomId(roomId);
		if (!deletedSchedule) {
			throw new HttpException(ScheduleErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}

	@Get('getAll')
	async getAll(@Query('page') page: number, @Query('limit') limit: number) {
		const schedules = await this.scheduleService.getAll(page, limit);
		if (!schedules) {
			throw new HttpException(ScheduleErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return schedules;
	}

	@Get(':id')
	async getById(@Param('id') id: string) {
		return await this.scheduleService.getById(id);
	}
	@Get('getByRoomId/:roomId')
	async getByRoomId(@Param('roomId') roomId: string) {
		const schedule = await this.scheduleService.getByRoomId(roomId);
		if (!schedule) {
			throw new HttpException(ScheduleErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return schedule;
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: UpdateScheduleDto) {
		const updatedSchedule = await this.scheduleService.update(id, dto);
		if (!updatedSchedule) {
			throw new HttpException(ScheduleErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		return updatedSchedule;
	}
}
