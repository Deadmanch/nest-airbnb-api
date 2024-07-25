import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomModel, RoomSchema } from './model/room.model';

@Module({
	controllers: [RoomController],
	imports: [
		MongooseModule.forFeature([
			{
				name: RoomModel.name,
				schema: RoomSchema,
			},
		]),
	],
	providers: [RoomService],
	exports: [MongooseModule],
})
export class RoomModule {}
