import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "product_categories" })
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 200 })
  name: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  slug: string;

  @Column({ type: "uuid", nullable: true })
  parent_id?: string;

  @Column({ type: "simple-json", nullable: false, default: "{}" })
  attribute_schema: any;
}
