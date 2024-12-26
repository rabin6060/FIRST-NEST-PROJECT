import { ForbiddenException, Injectable } from '@nestjs/common';
import { BookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../../src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
    constructor(private prisma:PrismaService) {}

    getBookmarks(userId:number) {
        return this.prisma.bookmark.findMany({
            where:{
                userId
            }
        })
    }

    getBookmark(userId:number,bookmarkId:number) {
        return this.prisma.bookmark.findUnique({
            where:{
                id:bookmarkId,
                userId
            }
        })
    }

    async createBookmark(userId:number,dto:BookmarkDto) {
        try {
            const bookmark =await this.prisma.bookmark.create({
                data:{
                    userId,
                    ...dto
    
                    }    
            })
            return bookmark
        } catch (error) {
            throw new Error(error.message)
            
        }
    }

    async editBookmark(userId:number,bookmarkId:number,dto:EditBookmarkDto) {
        try {
            const bookmark =await this.prisma.bookmark.findUnique({
                where:{
                    id:bookmarkId
                }
            })
            //check if bookmark userId is same as logged in user
            if (!bookmark || bookmark.userId!==userId) {
                 throw new ForbiddenException('unauthorized to edit bookmark')
            }
            //update the bookmark
            const editedBookmark =await this.prisma.bookmark.update({
                where:{
                    id:bookmarkId,
                },
                data:{
                    ...dto
                }
            })
            return editedBookmark
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async deleteBookmark(userId:number,bookmarkId:number) {
        const bookmark =await this.prisma.bookmark.findUnique({
            where:{
                id:bookmarkId
            }
        })
        //check if bookmark userId is same as logged in user
            if (!bookmark || bookmark.userId!==userId) {
                throw new ForbiddenException('unauthorized to delete bookmark')
        }

        //delete the bookmark
       await this.prisma.bookmark.delete({
        where:{
            id:bookmarkId
        }
       })

        
    }
}
