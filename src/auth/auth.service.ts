import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
    constructor(private prisma:PrismaService){

    }
    async signup(dto:AuthDto){
        const {email,password} = dto
        //hash password
        const hashPassword = await argon.hash(password)

        //create and save user to db
        
        try {
            const user = await this.prisma.user.create({
                data:{
                    email,
                    hash:hashPassword
                }
            })
            delete user.hash
            //return user
            return user
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Email already exixts')
                }
            }
            throw error
        }
        
        
    }
    async signin(dto:AuthDto){
        const {email,password} = dto
        
        try {
            //find user by email
            const user = await this.prisma.user.findUnique({
                where:{
                    email
                }
            })
            if(!user){
                throw new ForbiddenException("Invalid credentials")
            }
            //compare password
            const isMatch = await argon.verify(user.hash,password)
            if(!isMatch){
                throw new ForbiddenException('Invalid credentials')
            }
            delete user.hash
            return user
        } catch (error) {
            throw error.message
        }
    }
}