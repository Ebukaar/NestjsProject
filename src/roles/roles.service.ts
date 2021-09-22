import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from 'src/global/error.codes';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {

  constructor(@InjectRepository(Role) private roleRepository: Repository<Role>

  ) {

  }


  async create(createRoleDto: CreateRoleDto): Promise<Role> {

    try {

      const newRole = this.roleRepository.create(createRoleDto);

      return await this.roleRepository.save(newRole);


      // const role = await this.roleRepository.save(newRole);

      // return role;

    } catch (error) {

      if (error && error.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: `There was a problem with role creation: ${error.message}`
        }, HttpStatus.BAD_REQUEST)

      } else {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `There was a problem with role creation: ${error.message}`
        }, HttpStatus.INTERNAL_SERVER_ERROR)

      }


    }

  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<UpdateResult> {
    
    try{

      return await this.roleRepository.update(id, { ...updateRoleDto })

    }catch(error){

      if (error && error.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: `There was a problem updating role data: ${error.message}`
        }, HttpStatus.BAD_REQUEST)
      }
      else {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `There was a problem updating role data: ${error.message}`
        }, HttpStatus.INTERNAL_SERVER_ERROR)

      }

    }
  }

  async findAll(): Promise<Role[]> {
    
    try {

      return await this.roleRepository.find();
    } catch(error){

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem accessing role data: ${error.message} `
      }, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  async findOne(id: number) {
    
    try {
      return await this.roleRepository.findOne(id);
    } catch (error) {

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem accessing role data: ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }


  async remove(id: number): Promise<DeleteResult> {
    try{

      return await this.roleRepository.delete(id);

    }catch(error){

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem deleting role data: ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }


/** Relationships */

async addUserById(userId: number, roleId: number): Promise<void> {

  try {

    return await this.roleRepository.createQueryBuilder()
      .relation(Role, "users")
      .of(roleId)
      .add(userId)
  } catch (error) {

    throw new HttpException({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: `There was a problem adding user by role Id: ${error.message}`
    }, HttpStatus.INTERNAL_SERVER_ERROR)



  }

}

async addUsersById(roleId: number, userIds: number[]): Promise<void> {

  try {

    return await this.roleRepository.createQueryBuilder()
      .relation(Role, "users")
      .of(roleId)
      .add(userIds)
  } catch (error) {

    throw new HttpException({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: `There was a problem adding users by role Id: ${error.message}`
    }, HttpStatus.INTERNAL_SERVER_ERROR)


  }

}


async removeUserById(userId: number, roleId: number): Promise<void> {

  try {

    return await this.roleRepository.createQueryBuilder()
      .relation(Role, "users")
      .of(roleId)
      .remove(userId)
  } catch (error) {

    throw new HttpException({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: `There was a problem deleting user by role Id: ${error.message}`
    }, HttpStatus.INTERNAL_SERVER_ERROR)


  }


}

async removeUsersById(roleId: number, userIds: number[]): Promise<void> {

  try {

    return await this.roleRepository.createQueryBuilder()
      .relation(Role, "users")
      .of(roleId)
      .remove(userIds)
  } catch (error) {

    throw new HttpException({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: `There was a problem deleting users by role Id: ${error.message}`
    }, HttpStatus.INTERNAL_SERVER_ERROR)


  }

}

}






















