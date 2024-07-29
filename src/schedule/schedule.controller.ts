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
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleErrors } from './schedule.constant';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../user/model/role.enum';
import { IdValidationPipe } from '../pipes/id-validation.pipe';

@Controller('schedule')
export class ScheduleController {
	constructor(private readonly scheduleService: ScheduleService) {}

	@UsePipes(new ValidationPipe())
	@UseGuards(JwtAuthGuard)
	@Post('create')
	async create(@Body() dto: CreateScheduleDto) {
		return await this.scheduleService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async softDelete(@Param('id', IdValidationPipe) id: string) {
		const deletedSchedule = await this.scheduleService.softDelete(id);
		if (!deletedSchedule) {
			throw new HttpException(ScheduleErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return deletedSchedule;
	}

	@UseGuards(JwtAuthGuard)
	@Delete('hardDelete/:id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedSchedule = await this.scheduleService.delete(id);
		if (!deletedSchedule) {
			throw new HttpException(ScheduleErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return deletedSchedule;
	}

	@UseGuards(JwtAuthGuard)
	@Delete('deleteByRoomId/:roomId')
	async deleteByRoomId(@Param('roomId', IdValidationPipe) roomId: string) {
		const deletedSchedule = await this.scheduleService.deleteByRoomId(roomId);
		if (!deletedSchedule) {
			throw new HttpException(ScheduleErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}

	@Roles(Role.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Get('getAll')
	async getAll(@Query('page') page: number, @Query('limit') limit: number) {
		const schedules = await this.scheduleService.getAll(page, limit);
		if (!schedules) {
			throw new HttpException(ScheduleErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return schedules;
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async getById(@Param('id', IdValidationPipe) id: string) {
		return await this.scheduleService.getById(id);
	}

	@Roles(Role.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Get('getByRoomId/:roomId')
	async getByRoomId(@Param('roomId', IdValidationPipe) roomId: string) {
		const schedule = await this.scheduleService.getByRoomId(roomId);
		if (!schedule) {
			throw new HttpException(ScheduleErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return schedule;
	}

	@Roles(Role.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Get('getBookingStatsForMonth/:month/:year')
	async getBookingStatsForMonth(@Param('month') month: number, @Param('year') year: number) {
		if (!month || !year) {
			throw new HttpException(ScheduleErrors.MONTH_AND_YEAR_REQUIRED, HttpStatus.BAD_REQUEST);
		}
		const bookingStats = await this.scheduleService.getBookingStatsForMonth(month, year);
		if (!bookingStats) {
			throw new HttpException(ScheduleErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return bookingStats;
	}

	@UsePipes(new ValidationPipe())
	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async update(@Param('id', IdValidationPipe) id: string, @Body() dto: UpdateScheduleDto) {
		const updatedSchedule = await this.scheduleService.update(id, dto);
		if (!updatedSchedule) {
			throw new HttpException(ScheduleErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		return updatedSchedule;
	}
}
