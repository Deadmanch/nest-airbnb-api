import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomModel, RoomSchema } from './model/room.model';
import { UserModule } from '../user/user.module';
import { FilesModule } from '../files/files.module';

@Module({
	controllers: [RoomController],
	imports: [
		MongooseModule.forFeature([
			{
				name: RoomModel.name,
				schema: RoomSchema,
			},
		]),
		UserModule,
		FilesModule,
	],
	providers: [RoomService],
	exports: [MongooseModule],
})
export class RoomModule {}
