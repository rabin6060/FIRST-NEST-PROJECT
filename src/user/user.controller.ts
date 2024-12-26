import { Body, Controller, Get,  Patch,  UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { getUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private userService:UserService){}

    @Get('me')
    me(@getUser() user:User){
        return user;
    }

    @Patch()
    editUser(@getUser('id') userId:number , @Body() dto:EditUserDto){
        return this.userService.editUser(userId,dto)
    }
   
}
