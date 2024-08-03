import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomModel, RoomSchema } from './model/room.model';
import { UserModule } from '../user/user.module';

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
	],
	providers: [RoomService],
	exports: [MongooseModule],
})
export class RoomModule {}
