import { Role } from '../user/model/role.enum';

export const AuthErrors = {
	USER_NOT_FOUND: 'Пользователь с таким логином не найден.',
	INCORRECT_PASSWORD: 'Неверный пароль.',
	ALLREADY_REGISTERED: 'Пользователь с таким email уже зарегистрирован.',
	EMAIL_EXISTS: 'Пользователь с таким email уже существует.',
	EMAIL_MUST_BE_STRING: 'Email должен быть строкой.',
	PASSWORD_MUST_BE_STRING: 'Пароль должен быть строкой.',
	NAME_MUST_BE_STRING: 'Имя должно быть строкой.',
	NO_PERMISSION: 'Недостаточно прав.',
	ROLE_IS_EMPTY: `Роль должна быть - ${Role.ADMIN} или ${Role.USER}.`,
};
