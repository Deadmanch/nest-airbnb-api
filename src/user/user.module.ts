import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModel, UserSchema } from './model/user.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	controllers: [UserController],
	providers: [UserService],
	imports: [MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }])],
	exports: [UserService],
})
export class UserModule {}
