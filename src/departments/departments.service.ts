import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from 'src/global/error.codes';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentsService {

  constructor(
    @InjectRepository(Department) private departmentRepository: Repository<Department>

  ){}


  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    
    try{
      const newDepartment = this.departmentRepository.create(createDepartmentDto);

      return await this.departmentRepository.save(newDepartment);

      // const department = await this.departmentRepository.save(newDepartment);

      // return department;

    }catch(error){

      if (error && error.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: `There was a problem with department creation: ${error.message}`
        }, HttpStatus.BAD_REQUEST)
      }

      else{
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `There was a problem with department creation: ${error.message}`
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      }

    }
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto): Promise<UpdateResult> {
    
    try{
      
      return await this.departmentRepository.update(id, {...updateDepartmentDto})

    }catch(error){

      if (error && error.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: `There was a problem updating department data: ${error.message}`
        }, HttpStatus.BAD_REQUEST)
      }

      else{
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `There was a problem updating department data: ${error.message}`
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      }

    }
  }

  async findAll(): Promise<Department[]>{
    
    try{

      return await this.departmentRepository.find();


    }catch(error){

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem accessing department data: ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  async findOne(id: number) {

    try{

      return await this.departmentRepository.findOne(id);


    }catch(error){

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem accessing department data: ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)

    }
    
  }

  

  async remove(id: number): Promise<DeleteResult> {
    
    try{
      return await this.departmentRepository.delete(id);


    }catch(error){

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem deleting department data: ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }




  
  /**Relationships */

  async addEmployeeById(departmentId: number, employeeId: number): Promise<void> {

    try{

      return await this.departmentRepository.createQueryBuilder()
      .relation(Department, 'employee')
      .of(departmentId)
      .add(employeeId)

    }catch(error){

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem adding an employee with department Id: ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)

    }
    
  }

  async removeEmployeeById(departmentId: number, employeeId: number): Promise<void> {
    
    try{

      return await this.departmentRepository.createQueryBuilder()
      .relation(Department, 'employee')
      .of(departmentId)
      .remove(employeeId)

    }catch(error){

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem removing an employee with department Id: ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)

    }
    
  }


  //Adding employees by department Id
  async addEmployeesById(departmentId: number, employeeIds: number[]): Promise<void> {

    try {

      return await this.departmentRepository.createQueryBuilder()
        .relation(Department, "employees")
        .of(departmentId)
        .add(employeeIds)
    } catch (error) {

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem adding employees with department Id: ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)


    }

  }


  //Remove employees by department Id
  async removeEmployeesById(departmentId: number, employeeIds: number[]): Promise<void> {

    try {

      return await this.departmentRepository.createQueryBuilder()
        .relation(Department, "employees")
        .of(departmentId)
        .remove(employeeIds)
    } catch (error) {

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem deleting employees with department Id:  ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)


    }

  }
}
