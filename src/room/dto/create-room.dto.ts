import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RoomErrors } from '../room.constants';
import { Transform } from 'class-transformer';

export class CreateRoomDto {
	@IsString({ message: RoomErrors.NUMBER_ROOM_MUST_BE_STRING })
	@IsNotEmpty({ message: RoomErrors.NUMBER_ROOM_MUST_BE_STRING })
	numberRoom: string;
	@IsString({ message: RoomErrors.TYPE_MUST_BE_STRING })
	@IsNotEmpty({ message: RoomErrors.TYPE_MUST_BE_STRING })
	type: string;
	@IsString({ message: RoomErrors.DESCRIPTION_MUST_BE_STRING })
	@IsNotEmpty({ message: RoomErrors.DESCRIPTION_MUST_BE_STRING })
	description: string;
	@IsBoolean({ message: RoomErrors.IS_SEA_VIEW_MUST_BE_BOOLEAN })
	@Transform(({ value }) => value === 'true' || value === true)
	isSeaView: boolean;
	@IsOptional({ message: RoomErrors.IMAGES_MUST_BE_ARRAY })
	@IsArray({ message: RoomErrors.IMAGES_MUST_BE_ARRAY })
	@IsString({ each: true, message: RoomErrors.IMAGES_MUST_BE_ARRAY_STRING })
	images: string[];
}
