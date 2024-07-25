import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect, Types } from 'mongoose';
import { roomTestDto, scheduleTestDto, updateRoomDto, updateScheduleDto } from './test.variables';
import { ScheduleErrors } from '../src/schedule/schedule.constant';
import { RoomErrors } from '../src/room/room.constants';

describe('AppController (e2e)', () => {
	let app: INestApplication;
	let createdRoomId: string;
	let createdScheduleId: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});
	it('room/create (POST) - success', async () => {
		await request(app.getHttpServer())
			.post('/room/create')
			.send(roomTestDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				createdRoomId = body._id;
				expect(createdRoomId).toBeDefined();
				return;
			});
	});
	it('room/create (POST) - fail - validate type', async () => {
		await request(app.getHttpServer())
			.post('/room/create')
			.send({ ...roomTestDto, type: 123 })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toContain(RoomErrors.TYPE_MUST_BE_STRING);
				return;
			});
	});
	it('room/create (POST) - fail - validate description', async () => {
		await request(app.getHttpServer())
			.post('/room/create')
			.send({ ...roomTestDto, description: 123 })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toContain(RoomErrors.DESCRIPTION_MUST_BE_STRING);
				return;
			});
	});
	it('room/create (POST) - fail - validate images must be array', async () => {
		await request(app.getHttpServer())
			.post('/room/create')
			.send({ ...roomTestDto, images: 123 })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toContain(RoomErrors.IMAGES_MUST_BE_ARRAY);
				return;
			});
	});
	it('room/create (POST) - fail - validate images must be not empty', async () => {
		await request(app.getHttpServer())
			.post('/room/create')
			.send({ ...roomTestDto, images: [] })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toContain(RoomErrors.IMAGES_MUST_BE_NOT_EMPTY);
				return;
			});
	});
	it('room/create (POST) - fail - validate images must be array of strings', async () => {
		await request(app.getHttpServer())
			.post('/room/create')
			.send({ ...roomTestDto, images: ['image1', 123] })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toContain(RoomErrors.IMAGES_MUST_BE_ARRAY_STRING);
				return;
			});
	});
	it('room/create (POST) - fail - validate isSeaView', async () => {
		await request(app.getHttpServer())
			.post('/room/create')
			.send({ ...roomTestDto, isSeaView: 123 })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toContain(RoomErrors.IS_SEA_VIEW_MUST_BE_BOOLEAN);
				return;
			});
	});

	it('schedule/create (POST) - success', async () => {
		scheduleTestDto.roomId = createdRoomId;
		await request(app.getHttpServer())
			.post('/schedule/create')
			.send(scheduleTestDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				createdScheduleId = body._id;
				expect(createdScheduleId).toBeDefined();
				return;
			});
	});
	it('scedule/create (POST) - fail - schedule already exists', async () => {
		await request(app.getHttpServer())
			.post('/schedule/create')
			.send(scheduleTestDto)
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(ScheduleErrors.ALREADY_EXISTS);
				return;
			});
	});
	it('schedule/create (POST) - fail - room not found', async () => {
		await request(app.getHttpServer())
			.post('/schedule/create')
			.send({ date: new Date().toISOString(), roomId: new Types.ObjectId().toHexString() })
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(RoomErrors.NOT_FOUND);
				return;
			});
	});
	it('schedule/create (POST) - fail - validate date', async () => {
		await request(app.getHttpServer())
			.post('/schedule/create')
			.send({ ...scheduleTestDto, date: 123 })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toContain(ScheduleErrors.DATE_MUST_BE_STRING);
				return;
			});
	});
	it('schedule/create (POST) - fail - validate roomId', async () => {
		await request(app.getHttpServer())
			.post('/schedule/create')
			.send({ ...scheduleTestDto, roomId: 123 })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toContain(ScheduleErrors.ROOM_ID_MUST_BE_STRING);
				return;
			});
	});

	it('schedule/getAll (GET) - success', async () => {
		await request(app.getHttpServer())
			.get('/schedule/getAll')
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(1);
				return;
			});
	});

	it('schedule/getById (GET) - success', async () => {
		await request(app.getHttpServer())
			.get(`/schedule/${createdScheduleId}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body._id).toBe(createdScheduleId);
				return;
			});
	});
	it('schedule/getById (GET) - fail - not found', async () => {
		await request(app.getHttpServer())
			.get(`/schedule/${new Types.ObjectId().toHexString()}`)
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(ScheduleErrors.NOT_FOUND);
				return;
			});
	});
	it('schedule/getByRoomId (GET) - success', async () => {
		await request(app.getHttpServer())
			.get(`/schedule/getByRoomId/${createdRoomId}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(1);
				return;
			});
	});
	it('schedule/getByRoomId (GET) - fail - not found', async () => {
		await request(app.getHttpServer())
			.get(`/schedule/getByRoomId/${new Types.ObjectId().toHexString()}`)
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(ScheduleErrors.NOT_FOUND);
				return;
			});
	});
	it('schedule/update (PATCH) - fail - not found', async () => {
		await request(app.getHttpServer())
			.patch(`/schedule/${new Types.ObjectId().toHexString()}`)
			.send({ date: new Date().toISOString() })
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(ScheduleErrors.NOT_FOUND);
				return;
			});
	});
	it('schedule/softDelete (DELETE) - success', async () => {
		await request(app.getHttpServer())
			.delete(`/schedule/${createdScheduleId}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.isDeleted).toBe(true);
				return;
			});
	});
	it('schedule/update (PATCH) - success', async () => {
		await request(app.getHttpServer())
			.patch(`/schedule/${createdScheduleId}`)
			.send(updateScheduleDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.date).toBe(new Date(updateScheduleDto.date).toISOString());
				return;
			});
	});
	it('schedule/update (PATCH) - fail - not found', async () => {
		await request(app.getHttpServer())
			.patch(`/schedule/${new Types.ObjectId().toHexString()}`)
			.send({ date: new Date().toISOString() })
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(ScheduleErrors.NOT_FOUND);
				return;
			});
	});

	it('schedule/deleteByRoomId (DELETE) - success', async () => {
		await request(app.getHttpServer())
			.delete(`/schedule/deleteByRoomId/${createdRoomId}`)
			.expect(200);
		await request(app.getHttpServer())
			.get(`/schedule/${createdScheduleId}`)
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(ScheduleErrors.NOT_FOUND);
				return;
			});
	});

	it('schedule/getAll (GET) - fail - empty', async () => {
		await request(app.getHttpServer())
			.get('/schedule/getAll')
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(ScheduleErrors.NOT_FOUND);
				return;
			});
	});

	it('schedule/hardDelete (DELETE) - success', async () => {
		await request(app.getHttpServer())
			.post('/schedule/create')
			.send(scheduleTestDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				createdScheduleId = body._id;
				expect(createdScheduleId).toBeDefined();
				return;
			});
		await request(app.getHttpServer())
			.delete(`/schedule/hardDelete/${createdScheduleId}`)
			.expect(200);
		await request(app.getHttpServer())
			.get(`/schedule/${createdScheduleId}`)
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(ScheduleErrors.NOT_FOUND);
				return;
			});
	});

	it('room/softDelete (DELETE) - success', async () => {
		await request(app.getHttpServer())
			.delete(`/room/${createdRoomId}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.isDeleted).toBe(true);
				return;
			});
	});
	it('room/getAll (GET) - success', async () => {
		await request(app.getHttpServer())
			.get('/room/getAll')
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(1);
				return;
			});
	});
	it('room/getById (GET) - fail - not found', async () => {
		await request(app.getHttpServer())
			.get(`/room/${new Types.ObjectId().toHexString()}`)
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(RoomErrors.NOT_FOUND);
				return;
			});
	});
	it('room/update (PATCH) - success', async () => {
		await request(app.getHttpServer())
			.patch(`/room/${createdRoomId}`)
			.send(updateRoomDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.type).toBe(updateRoomDto.type);
				return;
			});
	});

	it('room/update (PATCH) - fail - not found', async () => {
		await request(app.getHttpServer())
			.patch(`/room/${new Types.ObjectId().toHexString()}`)
			.send({ name: 'test' })
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(RoomErrors.NOT_FOUND);
				return;
			});
	});

	it('room/hardDelete (DELETE) - success', async () => {
		await request(app.getHttpServer()).delete(`/room/hardDelete/${createdRoomId}`).expect(200);
		await request(app.getHttpServer())
			.get(`/room/${createdRoomId}`)
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(RoomErrors.NOT_FOUND);
				return;
			});
	});
	it('room/getAll (GET) - fail - empty', async () => {
		await request(app.getHttpServer())
			.get('/room/getAll')
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(RoomErrors.NOT_FOUND);
				return;
			});
	});
	afterAll(() => {
		disconnect();
	});
});
