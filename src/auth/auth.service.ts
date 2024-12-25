import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2'

@Injectable()
export class AuthService {
    constructor(private prisma:PrismaService){

    }
    async signup(dto:AuthDto){
        const {email,password} = dto
        //hash password
        const hashPassword = await argon.hash(password)

        //create and save user to db
        const user = await this.prisma.user.create({
            data:{
                email,
                hash:hashPassword
            }
        })
        //return user
        return user
        
    }
    signin(){
        return {message: 'signin success'}
    }
}