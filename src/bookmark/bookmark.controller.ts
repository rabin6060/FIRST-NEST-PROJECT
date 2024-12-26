import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JwtGuard } from '../../src/auth/guard';
import { getUser } from '../../src/auth/decorator';
import { BookmarkDto, EditBookmarkDto } from './dto';


@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService:BookmarkService){}

    //get bookmark of user
    @Get()
    getBookmarks(@getUser('id') userId:number){
        return this.bookmarkService.getBookmarks(userId);
    }

    //get bookmark by id
    @Get(':id')
    getBookmark(
        @getUser('id') userId:number,
        @Param('id',ParseIntPipe) bookmarkId:number
    ){
        return this.bookmarkService.getBookmark(userId,bookmarkId);
    }

    //create bookmark
    @Post()
    createBookmark(@getUser('id') userId:number , @Body() dto:BookmarkDto){
        return this.bookmarkService.createBookmark(userId,dto);
    }

    //edit bookmark
    @Patch(':id')
    editBookmark(
        @getUser('id') userId:number,
        @Body() dto:EditBookmarkDto,
        @Param('id', ParseIntPipe) bookmarkId:number
    ){
        return this.bookmarkService.editBookmark(userId,bookmarkId,dto)
    }

    //delete bookmark
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteBookmark(
        @getUser('id') userId:number,
        @Param('id', ParseIntPipe) bookmarkId:number
    ){
        return this.bookmarkService.deleteBookmark(userId,bookmarkId);
    }
}
