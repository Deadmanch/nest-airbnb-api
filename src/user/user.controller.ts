import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserErrors } from './user.constants';
import { IdValidationPipe } from '../pipes/id-validation.pipe';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get(':id')
	async getById(@Param('id', IdValidationPipe) id: string) {
		const user = await this.userService.getById(id);
		if (!user) {
			throw new HttpException(UserErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return user;
	}

	@Get('getByEmail/:email')
	async getByEmail(@Param('email') email: string) {
		const user = await this.userService.getByEmail(email);
		if (!user) {
			throw new HttpException(UserErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return user;
	}
}
