import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import {DataSource, DataSourceOptions} from 'typeorm';
dotenvConfig({ path: './.development.env' });

// Check typeORM documentation for more information.
export const ormConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT),
  username:process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],

  // We are using migrations, synchronize should be set to false.
  synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: false,
  logging: false,

  // allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    
};

export default registerAs('typeorm', () => ormConfig)
export const dataSource = new DataSource(ormConfig)
