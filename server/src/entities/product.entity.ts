import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "products" })
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255, unique: true })
  slug: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "varchar", length: 100, unique: true })
  sku: string;

  @Column({ type: "uuid" })
  category_id: string;

  @Column({ type: "numeric", precision: 12, scale: 2, default: 0 })
  price: number;

  @Column({ type: "numeric", precision: 12, scale: 2, nullable: true })
  originalPrice: number;

  @Column({ type: "varchar", length: 500, nullable: true })
  image: string;

  @Column({ type: "int", default: 0 })
  stock: number;

  @Column({ type: "float", default: 0 })
  rating: number;

  @Column({ type: "int", default: 0 })
  reviewCount: number;

  @Column({ type: "simple-json", nullable: true })
  tags: string[];

  @Column({ type: "simple-json", nullable: false, default: "{}" })
  attributes: any;

  @Column({ type: "boolean", default: true })
  active: boolean;
}
