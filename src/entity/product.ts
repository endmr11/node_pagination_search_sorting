import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: string;
    @Column()
    title!: string;
    @Column()
    description!: string;
    @Column()
    image!: string;
    @Column()
    price!: number;
}