import { Module } from '@nestjs/common';
import { RoomModule } from './room/room.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from './schedule/schedule.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FilesModule } from './files/files.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: `mongodb://${configService.get<string>('MONGO_HOST')}/${configService.get<string>('MONGO_PORT')}`,
				user: configService.get<string>('MONGO_LOGIN'),
				pass: configService.get<string>('MONGO_PASSWORD'),
				authSource: configService.get<string>('MONGO_AUTHDATABASE'),
			}),
			inject: [ConfigService],
		}),
		RoomModule,
		ScheduleModule,
		AuthModule,
		UserModule,
		FilesModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
