import { DataSource } from "typeorm";
import { Category } from "./entities/category.entity";
import { Product } from "./entities/product.entity";
import { Wishlist } from "./entities/wishlist.entity";
import { Reaction } from "./entities/reaction.entity";
import { Comment } from "./entities/comment.entity";
import { StockRequest } from "./entities/stock-request.entity";

// If DB_HOST is provided, use Postgres (for Docker/devops). Otherwise fall back to SQLite for
// local development so the user can run the server without Docker.
/**
 * Attempt to create and initialize a Postgres DataSource.
 * If Postgres is not reachable, fall back to a local SQLite DataSource for development.
 */
export let AppDataSource: DataSource | null = null;

export async function initializeDataSource(): Promise<DataSource> {
  const pgOptions = {
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER || 'nexus_user',
    password: process.env.DB_PASS || 'nexus_pass',
    database: process.env.DB_NAME || 'nexus_db',
    synchronize: true,
    logging: false,
    entities: [Category, Product, Wishlist, Reaction, Comment, StockRequest],
  };

  const pgDataSource = new DataSource(pgOptions as any);
  try {
    await pgDataSource.initialize();
    AppDataSource = pgDataSource;
    return pgDataSource;
  } catch (err) {
    console.warn('Postgres not available, falling back to SQLite for development:', err && err.message ? err.message : err);
    const sqliteDs = new DataSource({
      type: 'sqlite',
      database: process.env.SQLITE_FILE || 'dev.sqlite',
      synchronize: true,
      logging: false,
      entities: [Category, Product, Wishlist, Reaction, Comment, StockRequest],
    });
    await sqliteDs.initialize();
    AppDataSource = sqliteDs;
    return sqliteDs;
  }
}
