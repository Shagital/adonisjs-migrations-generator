const MigrationGenerator = require(`${__dirname}/../MigrationsGenerator`);

class Mysql extends MigrationGenerator {
  constructor(props) {
    super(props);
    this.dbType = props.dbType;
  }

  async getTables() {
    if (this.include.length) {
      for (let t of this.include) {
        this.tables[t.trim()] = {};
      }
      console.info(`Using passed tables: `, this.include);
      return this;
    }
    console.info(`Fetching all tables in DB`);
    let queryResults = await this.database.raw('SHOW TABLES');

    console.info(`Excluding tables`, this.exclude);

    Object.values(queryResults[0]).forEach(table => {
      let t = table[`Tables_in_${this.dbName}`];
      if (!this.exclude.includes(t)) {
        this.tables[table[`Tables_in_${this.dbName}`]] = {};
      }
    });

    return this;
  }

  async tableColumns() {
    let tables = this.tables;
    for (let tableName in tables) {
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

      let indexes = await this.database.raw("SHOW INDEX FROM `" + tableName + "` FROM `" + this.dbName + "`");
      Object.keys(tableColumns[0]).forEach(key => {
        let tableColumn = tableColumns[0][key];
        this.tables[tableName][tableColumn.COLUMN_NAME] = tableColumn;
        this.tables[tableName][tableColumn.COLUMN_NAME]['indexes'] = indexes[0].filter(s => tableColumn.COLUMN_NAME === s['Column_name']);
      });
    }
    return this;

  }

  async connectDb() {
    let query = await this.database.raw('SELECT DATABASE()');
    this.dbName = query[0][0]['DATABASE()'];
    console.log(`DB Name: ${this.dbName}`);
    return this;
  }

  generateMigrationContent(tableName) {
    console.info(`Generating migration file for table: ${tableName}`);

    let columnString = this.generateColumns(this.tables[tableName]);

    let pascalTableName = this.snakeToPascal(tableName);

    return this.stubContent
      .replace(new RegExp(`{{disableforeignKeyConstraint}}`, 'g'), this.disableForeignKeyConstraint
        ? `return Promise.all([
        Database.raw("SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS;"),
        Database.raw("SET FOREIGN_KEY_CHECKS=0;")
        ]).then( () => {`
        : ``
      )
      .replace(new RegExp(`{{enableforeignKeyConstraint}}`, 'g'), this.disableForeignKeyConstraint
        ? `});`
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
  }

  generateColumns(columns) {
    let columnString = "\t\t\t";
    let columnIndexes = {};
    Object.keys(columns).forEach(columnName => {
      let column = columns[columnName];
      let indexes = column['indexes'];
      for (let index of indexes) {
        columnIndexes[index['Key_name']] = columnIndexes[index['Key_name']] || [];
        columnIndexes[index['Key_name']].push(index['Column_name']);
      }
      let columnType = column['COLUMN_TYPE'].split(' ')[1];
      switch (column['DATA_TYPE']) {
        case 'timestamp':
          columnString += `table.timestamp('${column['COLUMN_NAME']}')`;
          if (column['COLUMN_DEFAULT'] === 'CURRENT_TIMESTAMP') {
            columnString += `.defaultTo(knex.fn.now())`
          }
          break;
        case 'int':
        case 'tinyint':
        case 'bigint':
          columnString += column['EXTRA'] === 'auto_increment'
            ? `table.increments('${column['COLUMN_NAME']}')`
            : `table.integer('${column['COLUMN_NAME']}', ${column['NUMERIC_PRECISION']})`;
          break;
        case 'varchar':
          columnString += `table.string('${column['COLUMN_NAME']}', ${column['CHARACTER_MAXIMUM_LENGTH']})`;
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
      if (referenceTable && primaryKeyColumn) {
        columnString += `.references('${primaryKeyColumn}').inTable('${referenceTable}').withKeyName('${column['TABLE_NAME'].substr(-25)}_${column['COLUMN_NAME']}_${this.random(2, true)}')`;
      }
      columnString += columnType === 'unsigned' ? `.unsigned()` : ``;
      columnString += column['COLUMN_KEY'] === 'UNI' ? `.unique()` : ``;
      columnString += column['COLUMN_DEFAULT'] ? `.defaultTo(${column['COLUMN_DEFAULT'] === 'CURRENT_TIMESTAMP' ? `Database.fn.now()` : `'${column['COLUMN_DEFAULT']}'`})` : ``;
      columnString += column['IS_NULLABLE'] === 'NO' ? `` : `.nullable()`;
      columnString += `;\n\t\t\t\t\t`;
    });

    Object.keys(columnIndexes).forEach(key => {
      if (key !== 'PRIMARY') {
        columnString += `\n\t\t\t\t\ttable.index(['${columnIndexes[key].join("','")}'], '${key.substr(-25)}_${this.random(2, true)}');`;
      }
    });
    return columnString;

  }
}

module.exports = Mysql;
