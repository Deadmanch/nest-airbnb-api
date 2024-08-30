import { ConfigService } from '@nestjs/config';

export const getTelegramConfig = (configService: ConfigService) => {
	const token = configService.get<string>('TELEGRAM_BOT_TOKEN');
	if (!token) {
		throw new Error('TELEGRAM_BOT_TOKEN is not defined');
	}
	return {
		token,
		chatId: configService.get<string>('TELEGRAM_CHAT_ID') ?? '',
	};
};
