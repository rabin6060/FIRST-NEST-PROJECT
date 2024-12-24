import { Injectable } from '@nestjs/common';

@Injectable({
})
export class AuthService {
    signup(){
        return {message: 'signup success'}
    }
    signin(){
        return {message: 'signin success'}
    }
}