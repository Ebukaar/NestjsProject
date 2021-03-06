import { Employee } from "src/employees/entities/employee.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Department {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({nullable: false})
    description: string;

    @Column()
    location: string; 


    @OneToMany(()=> Employee, employee => employee.department)
    employees: Employee[]


    





}

