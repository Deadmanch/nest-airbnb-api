import { ScheduleModel } from '../schedule/model/schedule.model';
import { RoomModel } from '../room/model/room.model';

export const generateCreateSсheduleMessage = (room: RoomModel, date: string): string => {
	const message =
		`🔔 Уведомление для администраторов - бронь создана 🔔\n` +
		`📌 Комната №:${room.numberRoom}\n` +
		`🏷️ Тип комнаты: ${room.type}\n` +
		`📅 Дата бронирования: ${date}\n` +
		`✔️ Комната успешно забронирована клиентом!\n` +
		`🛠️ Просим проверить все детали и подготовить комнату к заселению!`;

	return message;
};

export const generateDeleteSсheduleMessage = (schedule: ScheduleModel): string => {
	const message =
		'🔔 Уведомление для администраторов - бронь удалена 🔔\n' +
		`📌 Комната ID: ${schedule.roomId}\n` +
		`📅 Дата удалённого бронирования: ${schedule.date.toLocaleDateString()}\n` +
		'🛠️ Просим проверить и связаться с клиентом для уточнения деталей!';

	return message;
};
