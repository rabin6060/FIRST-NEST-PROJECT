import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private prisma:PrismaService,
        private jwt:JwtService,
        private config:ConfigService
    ){

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
            
            //return user
            return this.signToken(user.id,user.email)
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
            return this.signToken(user.id,user.email)
        } catch (error) {
            throw error.message
        }
    }

    async signToken(userId:number,email:string):Promise<{access_token:string}>{
        const payload = {sub:userId,email}
        const secret = this.config.get<string>('JWT_SECRET')
        const token = await this.jwt.signAsync(payload,{
            expiresIn:'20m',
            secret:secret
        })
        return {access_token:token}
    }
}