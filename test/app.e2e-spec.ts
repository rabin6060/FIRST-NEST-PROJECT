import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { PrismaService } from '../src/prisma/prisma.service'
import * as pactum from 'pactum'
import { AuthDto } from '../src/auth/dto/auth.dto'
import { EditUserDto } from '../src/user/dto'
import { BookmarkDto, EditBookmarkDto } from '../src/bookmark/dto'

describe('app e2e',()=>{
  let app:INestApplication;
  let prisma : PrismaService;
  beforeAll(async()=>{
    //simulating the server
    const moduleRef = await Test.createTestingModule({
      imports:[AppModule]
    }).compile()

    // Create a NestJS application instance from the compiled module
    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({
      whitelist:true,
    }))

    // Initialize the application
    app.init()
    app.listen(3333)

    // Retrieve the PrismaService instance from the application
    prisma = app.get(PrismaService)

    // Cleanup the database before tests
    await prisma.cleanup()
    pactum.request.setBaseUrl('http://localhost:3333/')
  }) 
  //closing app after all the testing
  afterAll(()=>{
    app.close()
  })

  
  describe('Auth', () => { 
    const dto:AuthDto = {
      email:'abc@gmail.com',
      password:'abc'
    }
    describe('signup', () => { 
      it('should throw error if email is empty',()=>{
        return pactum
        .spec()
        .post('auth/signup')
        .withBody({password:dto.password})
        .expectStatus(400)
      })
  

      it('should throw error if password is empty',()=>{
        return pactum
        .spec()
        .post('auth/signup')
        .withBody({email:dto.email})
        .expectStatus(400)
      })

      it('should throw error if no body provided',()=>{
        return pactum
        .spec()
        .post('auth/signup')
        .expectStatus(400)
      })
     
      it('should signup',()=>{
        return pactum
        .spec()
        .post('auth/signup',)
        .withBody(dto)
        .expectStatus(201)
      })
     })
    describe('signin', () => { 
      it('should throw error if email is empty',()=>{
        return pactum
        .spec()
        .post('auth/signin')
        .withBody({password:dto.password})
        .expectStatus(400)
      })
  

      it('should throw error if password is empty',()=>{
        return pactum
        .spec()
        .post('auth/signin')
        .withBody({email:dto.email})
        .expectStatus(400)
      })

      it('should throw error if no body provided',()=>{
        return pactum
        .spec()
        .post('auth/signin')
        .expectStatus(400)
      })

      it('should signin',()=>{
        return pactum
        .spec()
        .post('auth/signin')
        .withBody(dto)
        .expectStatus(200)
        .stores('userToken','access_token')
      })
     })
  
   })
  describe('User', () => { 
    describe('get me', () => { 
      it('should return user',()=>{
        return pactum
        .spec()
        .get('user/me')
        .withHeaders({
          'Authorization': 'Bearer $S{userToken}'
        })
        .expectStatus(200)
      })
     })

     describe('edit user', () => { 
      const dto:EditUserDto = {
        firstName:'ram',
        email:'adf@gmail.com'
      }
      it('should edit user',()=>{
        return pactum
        .spec()
        .patch('user')
        .withHeaders({
          'Authorization': 'Bearer $S{userToken}'
        })
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.firstName)
        .expectBodyContains(dto.email)
      })
     })
   })
  describe('Bookmark', () => { 
    describe('get empty bookmark after signin', () => { 
      it('should return empty array',()=>{
        return pactum
        .spec()
        .get('bookmarks')
        .withHeaders({
          'Authorization':'Bearer $S{userToken}'})
        .expectStatus(200)
        .expectBody([])
     })})
    describe('create bookmark', () => { 
      const dto:BookmarkDto = {
        title:'abc',
        link:'abc.com'
      }
      it('should create bookmark',()=>{
        return pactum
        .spec()
        .post('bookmarks')
        .withHeaders({
          'Authorization':'Bearer $S{userToken}'})
        .withBody(dto)
        .expectStatus(201)
        .inspect()
        .stores('bookmarkId','id')
      })

     })
    describe('get all', () => { 
      it('should get bookmarks',()=>{
        return pactum
        .spec()
        .get('bookmarks')
        .withHeaders({
          'Authorization':'Bearer $S{userToken}'})
        .expectStatus(200)
        .inspect()
      })
     })

     describe('get bookmark by id', () => { 
      it('should get a bookmark',()=>{
        return pactum
        .spec()
        .get('bookmarks/{id}')
        .withPathParams('id','$S{bookmarkId}')
        .withHeaders({
          'Authorization':'Bearer $S{userToken}'})
        .expectStatus(200)
        .inspect()
        .expectBodyContains('$S{bookmarkId}')
      })
     })

     describe('edit bookmark', () => { 
      const dto:EditBookmarkDto = {
        title:'edit'
      }
      it('should edit bookmark by id',()=>{
        return pactum
        .spec()
        .patch('bookmarks/{id}')
        .withPathParams('id','$S{bookmarkId}')
        .withHeaders({
          'Authorization':'Bearer $S{userToken}'})
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.title)
      })
     })
 
     describe('delete', () => { 
      it('should delete bookmark by id',()=>{
        return pactum
        .spec()
        .delete('bookmarks/{id}')
        .withPathParams('id','$S{bookmarkId}')
        .withHeaders({
          'Authorization':'Bearer $S{userToken}'})
        .expectStatus(204)
        .inspect()
      })

     })
   })
}) 