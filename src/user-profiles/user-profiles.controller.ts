import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserProfilesService } from './user-profiles.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserProfile } from './entities/user-profile.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user-profiles')
@Controller('user-profiles')
export class UserProfilesController {
  constructor(private readonly userProfilesService: UserProfilesService) {}

  
  @Post()
  create(@Body() createUserProfileDto: CreateUserProfileDto): Promise<UserProfile> {
    return this.userProfilesService.create(createUserProfileDto);

  }

  @Get()
  findAll() {
    return this.userProfilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userProfilesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserProfileDto: UpdateUserProfileDto) {
    return this.userProfilesService.update(+id, updateUserProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userProfilesService.remove(+id);
  }

  /**Let's work on relationships */
}