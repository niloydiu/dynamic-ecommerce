import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "products" })
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100, unique: true })
  sku: string;

  @Column({ type: "uuid" })
  category_id: string;

  @Column({ type: "numeric", precision: 12, scale: 2, default: 0 })
  price: number;

  @Column({ type: "int", default: 0 })
  inventory_count: number;

  @Column({ type: "simple-json", nullable: false, default: '{}' })
  attributes: any;

  @Column({ type: "boolean", default: true })
  active: boolean;
}
