import { IsEmail, IsEnum, IsPhoneNumber, IsString } from 'class-validator';
import { AuthErrors } from '../auth.constants';
import { Role } from '../../user/model/role.enum';

export class RegisterUserDto {
	@IsEmail({}, { message: AuthErrors.EMAIL_MUST_BE_STRING })
	email: string;
	@IsString({ message: AuthErrors.PASSWORD_MUST_BE_STRING })
	password: string;
	@IsEnum(Role, { message: AuthErrors.ROLE_IS_EMPTY })
	role: string;
	@IsPhoneNumber()
	phone: string;
	@IsString({ message: AuthErrors.NAME_MUST_BE_STRING })
	name: string;
}
