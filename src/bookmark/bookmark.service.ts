import { Injectable } from '@nestjs/common';
import { BookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {

    getBookmarks(userId:number) {}

    getBookmark(userId:number,bookmarkId:number) {}

    createBookmark(userId:number,dto:BookmarkDto) {}

    editBookmark(userId:number,bookmarkId:number,dto:EditBookmarkDto) {}

    deleteBookmark(userId:number,bookmarkId:number) {}
}
