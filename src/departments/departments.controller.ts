import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@ApiTags('departments')
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  
  @Post()
  create(@Body() createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentsService.update(+id, updateDepartmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentsService.remove(+id);
  }

  /**Let's work on relationships */

  // ?employeeid=1&employeeid=2&employeeid=5
  @Patch(':departmentId/employees')
  addEmployeesById(@Param('departmentId') departmentId: string, @Query() query: string): Promise<void> {

    return this.departmentsService.addEmployeesById(+departmentId, query['employeeid'])

  }
  
  @Patch(':departmentId/employees/:employeeId')
  addEmployeeById(@Param('departmentId') departmentId: string, @Param('employeeId') employeeId: string): Promise<void> {

    return this.departmentsService.addEmployeeById(+departmentId, +employeeId)

  }

  @Delete(':departmentId/employees/:employeeId')
  removeEmployeeById(@Param('departmentId') departmentId: string, @Param('employeeId') employeeId: string): Promise<void> {

    return this.departmentsService.removeEmployeeById(+departmentId, +employeeId)

  }

  @Delete(':departmentId/employees')
  removeEmployeesById(@Param('departmentId') departmentId: string, @Query() query: string): Promise<void> {

    return this.departmentsService.removeEmployeesById(+departmentId, query['employeeid'])

  }


 
}
