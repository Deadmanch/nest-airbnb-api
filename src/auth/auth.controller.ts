import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AuthErrors } from './auth.constants';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly userService: UserService,
		private readonly authService: AuthService,
	) {}

	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: RegisterUserDto) {
		const oldUser = await this.userService.getByEmail(dto.email);
		if (oldUser) {
			throw new BadRequestException(AuthErrors.ALLREADY_REGISTERED);
		}
		return await this.userService.create(dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() { email, password }: LoginUserDto) {
		const user = await this.authService.validateUser(email, password);
		const result = await this.authService.login(user.email);
		return {
			access_token: result.access_token,
			user: {
				email: user.email,
				role: result.user?.role,
			},
		};
	}
}
