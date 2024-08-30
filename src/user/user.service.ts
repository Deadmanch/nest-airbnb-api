import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserModel } from './model/user.model';
import { Model } from 'mongoose';
import { ICreateUser } from './interfaces/create-user.interface';
import { genSalt, hash } from 'bcryptjs';
import { UserErrors } from './user.constants';

@Injectable()
export class UserService {
	constructor(@InjectModel(UserModel.name) private readonly userModel: Model<UserDocument>) {}

	async create(data: ICreateUser): Promise<UserDocument> {
		const salt = await genSalt(10);
		return await this.userModel.create({
			...data,
			passwordHash: await hash(data.password, salt),
		});
	}

	async getById(id: string): Promise<UserDocument | null> {
		const existingUser = await this.userModel.findById(id).exec();
		if (!existingUser) {
			throw new HttpException(UserErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return existingUser;
	}

	async getByEmail(email: string): Promise<UserDocument | null> {
		const existingUser = await this.userModel.findOne({ email }).exec();
		if (!existingUser) {
			throw new HttpException(UserErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return existingUser;
	}
}
