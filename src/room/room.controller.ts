import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomErrors } from './room.constants';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../user/model/role.enum';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from '../files/files.service';
import { FileElementResponse } from '../files/dto/file-element.response';

@Controller('room')
export class RoomController {
	constructor(
		private readonly roomService: RoomService,
		private readonly filesService: FilesService,
	) {}

	@UsePipes(new ValidationPipe())
	@Roles(Role.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Post('create')
	@UseInterceptors(FilesInterceptor('images'))
	async create(@Body() dto: CreateRoomDto, @UploadedFiles() images: Express.Multer.File[]) {
		const imageUrls: FileElementResponse[] = [];
		for (const image of images) {
			const response = await this.filesService.saveAsWebp(image);
			imageUrls.push(response);
		}
		dto.images = imageUrls.map((file) => file.url);
		return await this.roomService.create(dto);
	}

	@Roles(Role.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Delete(':id')
	async softDelete(@Param('id') id: string) {
		return await this.roomService.softDelete(id);
	}

	@Roles(Role.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Delete('hardDelete/:id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		return await this.roomService.delete(id);
	}
	@Get('getAll')
	async getAll(@Query('page') page: number, @Query('limit') limit: number) {
		return await this.roomService.getAll(page, limit);
	}

	@Get(':id')
	async getById(@Param('id', IdValidationPipe) id: string) {
		return await this.roomService.getById(id);
	}

	@UsePipes(new ValidationPipe())
	@Roles(Role.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Patch(':id')
	@UseInterceptors(FilesInterceptor('images'))
	async update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateRoomDto,
		@UploadedFiles() images: Express.Multer.File[],
	) {
		const imageUrls: FileElementResponse[] = [];
		for (const image of images) {
			const response = await this.filesService.saveAsWebp(image);
			imageUrls.push(response);
		}
		dto.images = imageUrls.map((file) => file.url);
		const updatedRoom = await this.roomService.update(id, dto);
		if (!updatedRoom) {
			throw new HttpException(RoomErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return updatedRoom;
	}
}
