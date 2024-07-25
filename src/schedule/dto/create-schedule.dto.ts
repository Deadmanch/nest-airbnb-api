import { IsString } from 'class-validator';
import { ScheduleErrors } from '../schedule.constant';

export class CreateScheduleDto {
	@IsString({ message: ScheduleErrors.ROOM_ID_MUST_BE_STRING })
	roomId: string;
	@IsString({ message: ScheduleErrors.DATE_MUST_BE_STRING })
	date: string;
}
