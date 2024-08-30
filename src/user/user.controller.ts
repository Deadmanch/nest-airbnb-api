import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get(':id')
	async getById(@Param('id', IdValidationPipe) id: string) {
		return await this.userService.getById(id);
	}

	@Get('getByEmail/:email')
	async getByEmail(@Param('email') email: string) {
		return await this.userService.getByEmail(email);
	}
}
