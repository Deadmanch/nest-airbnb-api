import {
	CanActivate,
	ExecutionContext,
	HttpException,
	HttpStatus,
	Injectable,
} from '@nestjs/common';
import { Role } from '../../user/model/role.enum';
import { UserService } from '../../user/user.service';
import { AuthErrors } from '../auth.constants';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private readonly userService: UserService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const { user } = await context.switchToHttp().getRequest();
		const userData = await this.userService.getByEmail(user.email);
		if (userData?.role !== Role.ADMIN) {
			throw new HttpException(AuthErrors.NO_PERMISSION, HttpStatus.FORBIDDEN);
		}
		return true;
	}
}
