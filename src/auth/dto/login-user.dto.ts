import { IsEmail, IsString } from 'class-validator';
import { AuthErrors } from '../auth.constants';

export class LoginUserDto {
	@IsEmail({}, { message: AuthErrors.EMAIL_MUST_BE_STRING })
	email: string;

	@IsString({ message: AuthErrors.PASSWORD_MUST_BE_STRING })
	password: string;
}
