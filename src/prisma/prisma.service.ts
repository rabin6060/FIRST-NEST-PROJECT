import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient{
    constructor(config:ConfigService){
        super({
            datasources:{
                db:{
                    url: config.get<string>('DATABASE_URL'),
                }
            }
        })
    }
    //cleanup should be done before e2e testing
    cleanup(){
        return this.$transaction([
            this.bookmark.deleteMany(),
            this.user.deleteMany()
        ])
    }
}
