import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn } from 'typeorm';

@Entity({ name: 'wishlists' })
@Unique(['user_id', 'product_id'])
export class Wishlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  user_id: string;

  @Column({ type: 'uuid' })
  product_id: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
