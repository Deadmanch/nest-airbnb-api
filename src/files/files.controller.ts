import {
	Controller,
	HttpCode,
	Post,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { Role } from '../user/model/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { FileElementResponse } from './dto/file-element.response';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post('upload')
	@HttpCode(200)
	@Roles(Role.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@UseInterceptors(FilesInterceptor('files', 10))
	async upload(@UploadedFiles() files: Express.Multer.File[]): Promise<FileElementResponse[]> {
		const fileResponses: FileElementResponse[] = [];
		for (const file of files) {
			const response = await this.filesService.saveAsWebp(file);
			fileResponses.push(response);
		}
		return fileResponses;
	}
}
