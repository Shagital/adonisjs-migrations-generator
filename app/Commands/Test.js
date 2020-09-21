'use strict';

const { Command } = require('@adonisjs/ace');
const Database = use('Database');
const Env = use('Env');
const Helpers = use('Helpers');

class Test extends Command {
  constructor() {
    super();
    this.migrationTables = ['adonis_schema', 'migrations'];
    this.database = null;
    this.disableForeignKeyConstriant = true;
    this.dbName = null;
    this.connection = null;
    this.args = [];
    this.flags = [];
    this.tables = {};
  }

  static get signature () {
    return `migration:generate
            { --tables=@value : comma-separated name of the table(s) to generate migrations }
            { --exclude=@value : comma-separated name of the table(s) to  exclude from migrations }
            { --connection=@value : DB connection to use }
            { --disable-fkc : DB connection to use }
            `
  }

  static get description () {
    return 'Generate migration for DB tables'
  }

  async getTables() {
    let {tables, exclude} = this.flags;
    if(tables) {
     for(let t of tables.split(',')) {
       this.tables[t.trim()] = {};
     }
      this.info(`Using passed tables: ${tables}`);
      return this;
    }
    this.info(`Fetching all tables in DB`);
    let queryResults = await this.database.raw('SHOW TABLES');

    let excludedTables = this.migrationTables;
    if(exclude) {
      excludedTables = exclude.split(',');
      this.info(`Excluding tables: ${exclude}`);
    }
    Object.values(queryResults[0]).forEach(table => {
      let t = table[`Tables_in_${Env.get('DB_DATABASE')}`];

      if(!excludedTables.includes(t)) {
        this.tables[table[`Tables_in_${Env.get('DB_DATABASE')}`]] = [];
      }
    });

    return this;
  }

  async tableColumns() {
    let tables = this.tables;
    for(let tableName in tables) {
      let tableColumns = await this.database.raw(`
      select col.*,
      case when kcu.referenced_table_schema is null then null else '>-' end as rel,
      concat(kcu.referenced_table_schema, '.', kcu.referenced_table_name) as primary_table,
      kcu.referenced_column_name as pk_column_name, kcu.constraint_name as fk_constraint_name
      from information_schema.columns col
      join information_schema.tables tab on col.table_schema = tab.table_schema and col.table_name = tab.table_name
      left join information_schema.key_column_usage kcu on col.table_schema = kcu.table_schema
      and col.table_name = kcu.table_name and col.column_name = kcu.column_name
      and kcu.referenced_table_schema is not null where tab.table_type = 'BASE TABLE'
      and col.table_name = '${tableName}' and col.table_schema = '${this.dbName}'
      order by col.table_schema, col.table_name, col.ordinal_position
      `);

      let indexes = await this.database.raw("SHOW INDEX FROM `"+tableName+"` FROM `"+this.dbName+"`");
      Object.keys(tableColumns[0]).forEach(key => {
        let tableColumn = tableColumns[0][key];
       this.tables[tableName][tableColumn.COLUMN_NAME] = tableColumn;
       this.tables[tableName][tableColumn.COLUMN_NAME]['indexes'] = indexes[0].filter(s => tableColumn.COLUMN_NAME === s['Column_name']);
      });
    }
    return this;

  }

  async connectDb() {
    this.info('Fetching DB connection...');
    let {connection} = this.flags;
    this.connection = connection;
    this.database = Database.connection(this.connection || Env.get('DB_CONNECTION'));
    this.info(`Using DB Connection: ${this.connection || Env.get('DB_CONNECTION')}`);
      let query = await this.database.raw('SELECT DATABASE()');
      this.dbName = query[0][0]['DATABASE()'];
    this.info(`DB Name: ${this.dbName}`);
    return this;
  }

  async handle (args, flags) {
    this.flags = flags;
    this.disableForeignKeyConstriant = this.flags['disableFkc'] === null
      ? true
      : this.flags['disableFkc'];
    this.disableForeignKeyConstriant && this.warn(`Foreign key constraint disabled!`);
    this.args = args;
    this.info('Starting...');
    await this.connectDb();
    await this.getTables();
    await this.tableColumns();

    // console.log(this.tables);
    // process.exit()

    Object.keys(this.tables).forEach(tableName => {
      this.generateMigrationContent(tableName);
    });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  snakeToPascal( str ){
    str +='';
    str = str.split('_');

    function upper( str ){
      return str.slice(0,1).toUpperCase() + str.slice(1,str.length);
    }


    for(var i=0;i<str.length;i++){
      var str2 = str[i].split('/');
      for(var j=0;j<str2.length;j++){
        str2[j] = upper(str2[j]);
      }
      str[i] = str2.join('');
    }
    return str.join('');
  }

  async generateMigrationContent(tableName) {
    this.info(`Generating migration file for table: ${tableName}`);

    let contents = await this.readFile(__dirname+'/migration.js.stub', 'utf-8');
    let columnString = this.generateColumns(this.tables[tableName]);

    let pascalTableName = this.snakeToPascal(tableName);

    contents = contents
      .replace(new RegExp(`{{disableforeignKeyConstraint}}`, 'g'),this.disableForeignKeyConstriant
        ? `Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {`
        : ``
      )
      .replace(new RegExp(`{{enableforeignKeyConstraint}}`, 'g'),this.disableForeignKeyConstriant
        ? `}).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });`
        : ``
      )
      .replace(new RegExp(`{{tableName}}`, 'g'), `'${tableName}'`)
      .replace(new RegExp(`{{pascalTableName}}`, 'g'), `${pascalTableName}`)
      .replace('{{columns}}', columnString)
      .replace('{{setConnection}}', this.connection
        ? `
      static get connection () {
    return '${this.connection}'
  }
      ` : ``);


    let migrationPath = Helpers.databasePath(`migrations/${new Date().getTime()}_${tableName}.js`);
    await this.writeFile(migrationPath, contents);
    this.info(`Migration file saved to: ${migrationPath}`);
    }

    generateColumns(columns) {
      let columnString = "\t\t\t";
      Object.keys(columns).forEach(columnName => {
        let column = columns[columnName];
        let indexes = column['indexes'];
        let columnType = column['COLUMN_TYPE'].split(' ')[1];
        switch(column['DATA_TYPE']) {
          case 'timestamp':
            columnString += `table.timestamp('${column['COLUMN_NAME']}')`;
            if(column['COLUMN_DEFAULT:'] === 'CURRENT_TIMESTAMP') {
              columnString += `.defaultTo(knex.fn.now())`
            }
            break;
          case 'int':
           columnString +=  column['EXTRA'] === 'auto_increment'
             ? `table.increments('${column['COLUMN_NAME']}')`
             : `table.integer('${column['COLUMN_NAME']}')`;
            break;
          case 'varchar':
            columnString += `table.string('${column['COLUMN_NAME']}', ${column['CHARACTER_MAXIMUM_LENGTH']})`;
            break;
            case 'tinyint':
            columnString += `table.integer('${column['COLUMN_NAME']}', ${column['NUMERIC_PRECISION']})`;
            break;
          case 'decimal':
            columnString += `table.decimal('${column['COLUMN_NAME']}', ${column['NUMERIC_PRECISION']}, ${column['NUMERIC_SCALE']})`;
            break;
          case 'text':
            columnString += `table.text('${column['COLUMN_NAME']}')`;
            break;
          case 'enum':
            let options = column['COLUMN_TYPE'].substring(
              column['COLUMN_TYPE'].lastIndexOf("(") + 1,
              column['COLUMN_TYPE'].lastIndexOf(")"))
            columnString += `table.enum('${column['COLUMN_NAME']}', [${options}])`;
            break;
          default:
            columnString += `table.specificType('${column['COLUMN_NAME']}', '${column['DATA_TYPE']}')`;
        }
        //handle foreign key constraint
        let referenceTable = (column['primary_table'] || '').split('.')[1];
        let primaryKeyColumn = column['pk_column_name'];
        if(referenceTable && primaryKeyColumn) {
          columnString += `.references('${primaryKeyColumn}').inTable('${referenceTable}')`
        }
        columnString += columnType === 'unsigned' ? `.unsigned()` : ``;
        columnString += column['COLUMN_KEY'] === 'UNI' ? `.unique()` : ``;
        columnString += (indexes.find(s => s['Key_name'] === column['COLUMN_NAME'] ) ? `.index()` : ``);
        columnString += column['COLUMN_DEFAULT'] ?  `.defaultTo(${column['COLUMN_DEFAULT'] === 'CURRENT_TIMESTAMP' ? `Database.fn.now()` : `'${column['COLUMN_DEFAULT']}'`})` : ``;
        columnString += column['IS_NULLABLE'] === 'NO' ? `` : `.nullable()`;
        columnString += `;\n\t\t\t\t\t`;
      });

      return columnString;
    }
}

module.exports = Test;
