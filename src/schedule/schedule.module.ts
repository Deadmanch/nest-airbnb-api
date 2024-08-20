import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModel, ScheduleSchema } from './model/schedule.model';
import { ScheduleService } from './schedule.service';
import { RoomModule } from '../room/room.module';
import { UserModule } from '../user/user.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
	controllers: [ScheduleController],
	imports: [
		MongooseModule.forFeature([
			{
				name: ScheduleModel.name,
				schema: ScheduleSchema,
			},
		]),
		RoomModule,
		UserModule,
		TelegramModule,
	],
	providers: [ScheduleService],
})
export class ScheduleModule {}
