import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  user_id: string;

  @Column({ type: 'uuid' })
  product_id: string;

  @Column({ type: 'text' })
  text: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
