'use strict';

const fs = require('fs');
const {Command} = require('@adonisjs/ace');
const Database = use('Database');
const Env = use('Env');
const Config = use('Config');
const Mysql = require(`${__dirname}/../Databases/Mysql`);
const Sqlite = require(`${__dirname}/../Databases/Sqlite`);
const Helpers = use('Helpers');

class MigrationsGeneratorCommand extends Command {
  constructor() {
    super();
    this.dbType = null;
    this.supportedTypes = ['mysql', 'sqlite3'];
    this.migrationTables = ['adonis_schema', 'migrations'];
  }

  static get signature() {
    return `migration:generate
            { --include=@value : comma-separated name of the table(s) to generate migrations }
            { --exclude=@value : comma-separated name of the table(s) to  exclude from migrations }
            { --connection=@value : DB connection to use }
            { --disable-fkc : DB connection to use }
            { --force : Overwrite existing migration folder}
            { --path=@value : Directory to save migration files}
            `
  }

  static get description() {
    return 'Generate migration for DB tables'
  }

  getConnection(connection) {
    this.info('Fetching DB connection...');

    this.dbType = Config.get(`database.${connection}`).client;
    if (!this.supportedTypes.includes(this.dbType.toLowerCase())) {
      return false
    }

    this.info(`Using DB Connection: ${connection}`);
    return Database.connection(connection);

  }

  async handle(args, flags) {
    this.info('Starting...');
    flags.include = flags.include ? flags.include.split(',') : [];
    flags.exclude = (flags.exclude ? flags.exclude.split(',') : []).concat(this.migrationTables);
    flags.path = flags.path || Helpers.databasePath('migrations');
    flags.connection = flags.connection || Env.get('DB_CONNECTION');
    flags.disableFkc = flags.disableFkc === null ? true : !!flags.path;


    // if force is enabled, delete directory
    if (flags.force) {
      await this.removeDir(flags.path);
    }

    // if directory not exist, create
    if (!fs.existsSync(flags.path)) {
      fs.mkdirSync(flags.path);
    }

    this.info(`Migrations will be saved in ${flags.path}`);
    flags.disableFkc && console.warn(`Foreign key constraint disabled!`);

    flags.database = this.getConnection(flags.connection);
    if (!flags.database) {
      this.error(`Unsupported DB type [${this.dbType}]`);
      return;
    }

    let dbClass;
    flags.dbType = this.dbType;
    switch (this.dbType) {
      case 'mysql':
        dbClass = new Mysql(flags);
        break;
      case 'sqlite3':
        dbClass = new Sqlite(flags);
    }


    await dbClass.connectDb();
    await dbClass.getTables();
    await dbClass.tableColumns();

    await dbClass.generateMigrationFiles();

  }
}

module.exports = MigrationsGeneratorCommand;
