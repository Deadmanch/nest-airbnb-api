import { ArrayNotEmpty, IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { RoomErrors } from '../room.constants';

export class UpdateRoomDto {
	@IsOptional()
	@IsString({ message: RoomErrors.NUMBER_ROOM_MUST_BE_STRING })
	numberRoom?: string;
	@IsOptional()
	@IsString({ message: RoomErrors.TYPE_MUST_BE_STRING })
	type?: string;
	@IsOptional()
	@IsString({ message: RoomErrors.DESCRIPTION_MUST_BE_STRING })
	description?: string;
	@IsOptional()
	@IsArray({ message: RoomErrors.IMAGES_MUST_BE_ARRAY })
	@ArrayNotEmpty({ message: RoomErrors.IMAGES_MUST_BE_NOT_EMPTY })
	@IsString({ each: true, message: RoomErrors.IMAGES_MUST_BE_ARRAY_STRING })
	images?: string[];
	@IsOptional()
	@IsBoolean({ message: RoomErrors.IS_SEA_VIEW_MUST_BE_BOOLEAN })
	isSeaView?: boolean;
}
