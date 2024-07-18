import { Module } from '@nestjs/common';
import { ScheduleModule } from './schedule/schedule.module';
import { RoomModule } from './room/room.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: `mongodb://${configService.get<string>('MONGO_HOST')}/${configService.get<string>('MONGO_NAME')}`,
				user: configService.get<string>('MONGO_USER'),
				pass: configService.get<string>('MONGO_PASS'),
				authSource: configService.get<string>('MONGO_AUTHDATABASE'),
			}),
			inject: [ConfigService],
		}),
		ScheduleModule,
		RoomModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
