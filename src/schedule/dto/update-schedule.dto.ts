import { IsString } from 'class-validator';
import { ScheduleErrors } from '../schedule.constant';

export class UpdateScheduleDto {
	@IsString({ message: ScheduleErrors.ROOM_ID_MUST_BE_STRING })
	date: string;
}
