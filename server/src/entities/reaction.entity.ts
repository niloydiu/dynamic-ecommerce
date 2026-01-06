import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn } from 'typeorm';

@Entity({ name: 'reactions' })
@Unique(['user_id', 'product_id'])
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  user_id: string;

  @Column({ type: 'uuid' })
  product_id: string;

  @Column({ type: 'varchar', length: 20 })
  reaction: string; // 'like' or 'dislike'

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
