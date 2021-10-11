import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { UsersService } from './users.service';
//import { CreateUserDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiQuery, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { query } from 'express';


@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @ApiBadRequestResponse({ description: "Bad request: constraint problem" })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOkResponse(
    {
        description: "User successfully created",
        schema: {
            type: 'object',
            $ref: getSchemaPath(User)
        }
    })
  @Post()
  create(@Body() createUserDto: CreateUserDto, @Req() req: any): Promise<User> {
    return this.usersService.create(createUserDto, req);
  }


/**
 * Find users based on options provided in query. The query key expected is find-options.
 * @param query 
 * @returns 
 */
 @ApiQuery({ name: 'find-options', required: false, description: 'encodeURI(JSON.stringify({select?: string[]; relations?: string[]; skip?: number; take?: number;cache?: boolean; where?: {}[] | {}; order?: {};))' })
  @Get()
  //It is a get because we are not posting
  findAll(@Query() query: string): Promise<[User[], number]> {
    //return this.usersService.findAll();

    for (const queryKey of Object.keys(query)) {
      if (queryKey == "find-options") {
        return this.usersService.findAllWithOptions(decodeURI(query[queryKey]))
      }
    }
    return this.usersService.findAll()
  }

  @Get(':id')  // users/1
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  /** Let's work on relationships */
//   /users/1/roles/3  The http verb will be a patch 
  @Patch(':userId/roles/:roleId')
  addRoleById(@Param('userId') userId: string, @Param('roleId')roleId: string ): Promise<void> {

    return this.usersService.addRoleById(+userId, +roleId)
    //Since we indicated userId and roleId should be string, we need to add " + " in the return statement to force it to be a number. 

  }


  //  ?roleid=1&roleid=2&roleid=5
  @Patch(':userId/roles')
  addRolesById(@Param('userId') userId: string, @Query() query: string ): Promise<void> {

    return this.usersService.addRolesById(+userId, query['roleid '])


  }

  @Delete(':userId/roles/:roleId')
  removeRoleById(@Param('userId') userId: string, @Param('roleId') roleId: string): Promise<void> {

    return this.usersService.removeRoleById(+userId, +roleId)

  }


  @Delete(':userId/roles')
  removeRolesById(@Param('userId') userId: string, @Query() query: string ): Promise<void> {

    return this.usersService.removeRolesById(+userId, query['roleid'])

  }

  @Patch(':userId/user-profile/:userProfileId')
  setUserProfileById(@Param('userId') userId: string, @Param('userProfile') userProfileId: string ): Promise<void> {

    return this.usersService.setUserProfileById(+userId, +userProfileId)

  }

  @Delete(':userId/user-profile')
  unsetUserProfileById(@Param('userId') userId: string): Promise<void> {

    return this.usersService.unsetUserProfileById(+userId)

  }


  @Patch(':userId/employee/:employeeId')
  setEmployeeById(@Param('userId') userId: string , @Param('employeeId') employeeId: string): Promise<void> {

    return this.usersService.setEmployeeById(+userId, +employeeId)

  }

  @Delete(':userId/employee')
  unsetEmployeeById(@Param('userId') userId: string): Promise<void> {

    return this.usersService.unsetEmployeeById(+userId)

  }


}
