import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from 'src/global/error.codes';
import { logger } from '../main';

@Injectable()
export class UsersService {


  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectConnection('default')private connection: Connection //You can inject connection by name.See https://docs.nestjs.com/techniques/database#multiple-databases
    //If we dont provide "default" it will use the default still. 




  ) { }
  //This is where CRUD is done 
  async create(createUserDto: CreateUserDto, req: any): Promise<User> {

    try {
      const newUser = this.userRepository.create(createUserDto);

      //hash the password in the dto sent
      //This newUser was created in the dto
      await bcrypt.hash(newUser.passwordHash, 10).then((hash: string) => {
        newUser.passwordHash = hash
      })

      const user = await this.userRepository.save(newUser);

      await this.connection.queryResultCache.remove(["user"]);


      return user;

    } catch (error) {
      logger.error(error.message, { time: new Date(), request_method: req.method, endpoint: req.url, client: req.socket.remoteAddress, agent: req.headers['user-agent'] });
      logger.debug(error.stack, { time: new Date(),  request_method: req.method, endpoint: req.url, client: req.socket.remoteAddress, agent: req.headers['user-agent']});
      if (error && error.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: `There was a problem with user creation: ${error.message}`
        }, HttpStatus.BAD_REQUEST)

      } else {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `There was a problem with user creation: ${error.message}`
        }, HttpStatus.INTERNAL_SERVER_ERROR)

      }

    }

  }
  //When we make them async it means it will return a promise. 
  async update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {

    try {
      if (updateUserDto.passwordHash != '') {
        await bcrypt.hash(updateUserDto.passwordHash, 10).then((hash: string) => {
          updateUserDto.passwordHash = hash
        })
      }

      const  updateResult =  await this.userRepository.update(id, { ...updateUserDto })
      await this.connection.queryResultCache.remove(["user"]);
      return updateResult;

      // So, we want it to run then clear cache and return the updateResult. 

    } catch (error) {

      if (error && error.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: `There was a problem with user creation: ${error.message}`
        }, HttpStatus.BAD_REQUEST)
      }
      else {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `There was a problem with user creation: ${error.message}`
        }, HttpStatus.INTERNAL_SERVER_ERROR)

      }

    }

  }

  async findAll(): Promise<[User[], number]> {

    try {

      return await this.userRepository.findAndCount({
        cache: {
          id: "users",
          milliseconds: 100000
        } 
        //It means that when it runs the first time, it will remain in the cache. Assuming another user call for that info it will return what is already in the cache assuming nothing has changed.
      });

    } catch (error) {

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem accessing user data: ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)

    }

  }

  async findAllWithOptions(findOptions: string): Promise<[User[], number]>{
    try{
      return await this.userRepository.findAndCount(JSON.parse(findOptions));

    }catch (error) {

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem accessing user data: ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)

    }

  }

  async findOne(id: number) {

    try {

      return await this.userRepository.findOne(id);
    } catch (error) {

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem accessing user data: ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)

    }

  }



  async remove(id: number): Promise<DeleteResult> {

    try {
      return await this.userRepository.delete(id);

    } catch (error) {

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem deleting  user data: ${error.message}`

      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }







  
  /** Relationships */
  async addRoleById(userId: number, roleId: number): Promise<void> {

    try {

      return await this.userRepository.createQueryBuilder()
        .relation(User, "roles")
        .of(userId)
        .add(roleId)
    } catch (error) {

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem with adding a role with user Id: ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)


    }

  }

  async addRolesById(userId: number, roleIds: number[]): Promise<void> {

    try {

      return await this.userRepository.createQueryBuilder()
        .relation(User, "roles")
        .of(userId)
        .add(roleIds)
    } catch (error) {

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem adding roles with user Id: ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)


    }

  }




  async removeRoleById(userId: number, roleId: number): Promise<void> {

    try {

      return await this.userRepository.createQueryBuilder()
        .relation(User, "roles")
        .of(userId)
        .remove(roleId)
    } catch (error) {

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem deleting a role with user Id: ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)


    }

  }

  async removeRolesById(userId: number, roleIds: number[]): Promise<void> {

    try {

      return await this.userRepository.createQueryBuilder()
        .relation(User, "roles")
        .of(userId)
        .remove(roleIds)
    } catch (error) {

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem deleting roles with user Id:  ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)


    }

  }

  async setUserProfileById(userId: number, userProfileId: number): Promise<void> {
    try {

      return await this.userRepository.createQueryBuilder()
        .relation(User, "userProfile")
        .of(userId) 
        .set(userProfileId)

    } catch (error) { 

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem adding user-profile with user Id: ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)


    }
  }

  async unsetUserProfileById(userId: number): Promise<void> {
    try {

      return await this.userRepository.createQueryBuilder()
        .relation(User, "userProfile")
        .of(userId) 
        .set(null)

    } catch (error) {

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem deleting user-profile with user Id: ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)


    }
  }
}
