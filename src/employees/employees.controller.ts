import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }

  /** Let's work on relatiinships */


  @Patch(':employeeId/departments/:departmentId')
  setDepartmentById(@Param('employeeId') employeeId: string, @Param('departmentId') departmentId: string): Promise<void> {

    return this.employeesService.setDepartmentById(+employeeId, +departmentId)

  }

  @Delete(':employeeId/departments')
  unsetDepartmentById(@Param('employeeId') employeeId: string): Promise<void> {

    return this.employeesService.unsetDepartmentById(+employeeId)

  }
  
}
