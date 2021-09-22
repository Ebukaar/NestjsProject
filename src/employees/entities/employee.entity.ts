import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Employee {

    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ nullable: true }) //nullable just in case it is not allocated from the very beginning. 
    employeeNumber: string

    @Column()
    firstName: string

    @Column({ nullable: true })
    middleName: string

    @Column()
    lastName: string

    @Column({ nullable: true })
    jobPosition: string

    @Column({ nullable: true })
    jobTitle: string

    @Column({ nullable: true })
    photo: string
}
