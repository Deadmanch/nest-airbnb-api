import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { disconnect } from 'mongoose';
import { LoginUserTestDto, RegisterAdminTestDto, RegisterUserTestDto } from './test.variables';
import * as request from 'supertest';
import { AuthErrors } from '../src/auth/auth.constants';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/auth/register (POST) - fail - password is not string', async () => {
		await request(app.getHttpServer())
			.post('/auth/register')
			.send({ ...RegisterUserTestDto, password: 123 })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toContain(AuthErrors.PASSWORD_MUST_BE_STRING);
				return;
			});
	});

	it('/auth/register (POST) - fail - email is not string', async () => {
		await request(app.getHttpServer())
			.post('/auth/register')
			.send({ ...RegisterUserTestDto, email: 123 })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toContain(AuthErrors.EMAIL_MUST_BE_STRING);
				return;
			});
	});

	it('/auth/register (POST) - role is empty', async () => {
		await request(app.getHttpServer())
			.post('/auth/register')
			.send({ ...RegisterUserTestDto, role: '' })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toContain(AuthErrors.ROLE_IS_EMPTY);
				return;
			});
	});
	it('/auth/register (POST) - success - user created', async () => {
		await request(app.getHttpServer())
			.post('/auth/register')
			.send(RegisterUserTestDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				expect(body.email).toBe(RegisterUserTestDto.email);
				return;
			});
	});
	it('/auth/register (POST) - success - admin created', async () => {
		await request(app.getHttpServer())
			.post('/auth/register')
			.send(RegisterAdminTestDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				expect(body.email).toBe(RegisterAdminTestDto.email);
				return;
			});
	});

	it('/auth/register (POST) - fail - already registered', async () => {
		await request(app.getHttpServer())
			.post('/auth/register')
			.send(RegisterUserTestDto)
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(AuthErrors.ALLREADY_REGISTERED);
				return;
			});
	});

	it('/auth/login (POST) - fail - user not found', async () => {
		await request(app.getHttpServer())
			.post('/auth/login')
			.send({ email: 'mailnotfound@mail.com', password: RegisterUserTestDto.password })
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(AuthErrors.USER_NOT_FOUND);
				return;
			});
	});

	it('/auth/login (POST) - fail - email is not string', async () => {
		await request(app.getHttpServer())
			.post('/auth/login')
			.send({ email: 123, password: RegisterUserTestDto.password })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toContain(AuthErrors.EMAIL_MUST_BE_STRING);
				return;
			});
	});
	it('/auth/login (POST) - fail - password is not string', async () => {
		await request(app.getHttpServer())
			.post('/auth/login')
			.send({ email: RegisterUserTestDto.email, password: 123 })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toContain(AuthErrors.PASSWORD_MUST_BE_STRING);
				return;
			});
	});

	it('/auth/login (POST) - success', async () => {
		await request(app.getHttpServer())
			.post('/auth/login')
			.send(LoginUserTestDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.access_token).toBeDefined();
				return;
			});
	});

	afterAll(async () => {
		disconnect();
	});
});
