import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity({ name: "stock_requests" })
export class StockRequest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 320, nullable: true })
  email?: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  user_id?: string;

  @Column({ type: "uuid" })
  product_id: string;

  @Column({ type: "boolean", default: false })
  is_notified: boolean;

  @CreateDateColumn({ type: "datetime" })
  created_at: Date;
}
