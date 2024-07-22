import { ArrayNotEmpty, IsArray, IsBoolean, IsString } from 'class-validator';
import { RoomErrors } from '../room.constants';

export class UpdateRoomDto {
	@IsString({ message: RoomErrors.TYPE_MUST_BE_STRING })
	type?: string;
	@IsString({ message: RoomErrors.DESCRIPTION_MUST_BE_STRING })
	description?: string;
	@IsArray({ message: RoomErrors.IMAGES_MUST_BE_ARRAY })
	@ArrayNotEmpty({ message: RoomErrors.IMAGES_MUST_BE_NOT_EMPTY })
	@IsString({ each: true, message: RoomErrors.IMAGES_MUST_BE_ARRAY_STRING })
	images?: string[];
	@IsBoolean({ message: RoomErrors.IS_SEA_VIEW_MUST_BE_BOOLEAN })
	isSeaView?: boolean;
}
