const MigrationGenerator = require(`${__dirname}/../MigrationsGenerator`);
const Config = use('Config');

class SQLite extends MigrationGenerator {
  constructor(props) {
    super(props);
    this.dbType = props.dbType;
    this.exclude.push('sqlite_sequence');
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
    let queryResults = await this.database.raw("SELECT name FROM sqlite_master WHERE type='table'");

    console.info(`Excluding tables`, this.exclude);

    Object.values(queryResults).forEach(table => {
      let tableName = table['name'];
      if (!this.exclude.includes(tableName)) {
        this.tables[tableName] = {};
      }
    });

    return this;
  }

  async tableColumns() {
    let tables = this.tables;
    for (let tableName in tables) {
      let tableColumns = await this.database.raw(`PRAGMA table_info('${tableName}');`);

      let indexes = await this.database.raw(`PRAGMA index_list('${tableName}')`);

      Object.keys(tableColumns).forEach(key => {
        let tableColumn = tableColumns[key];
        this.tables[tableName][tableColumn['name']] = tableColumn;
        this.tables[tableName][tableColumn['name']]['indexes'] = indexes.filter(s => s['name'].split('_')[1] == tableColumn['name']);
      });

    }
    return this;

  }

  async connectDb() {
    this.dbName =  Config.get(`database.${this.connection}`).connection.filename;
    console.log(`DB Name: ${this.dbName}`);
    return this;
  }

  generateMigrationContent(tableName) {
    console.info(`Generating migration file for table: ${tableName}`);

    let columnString = this.generateColumns(this.tables[tableName]);

    let pascalTableName = this.snakeToPascal(tableName);

    return this.stubContent
      .replace(new RegExp(`{{disableforeignKeyConstraint}}`, 'g'), ``)
      .replace(new RegExp(`{{enableforeignKeyConstraint}}`, 'g'), ``)
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

    // console.log(JSON.stringify(columns, null, 4));
    // process.exit()
    Object.keys(columns).forEach(columnName => {
      let column = columns[columnName];
      let indexes = column['indexes'];
      let splitCol = column['type'].split('(');
      let columnType = splitCol[0].toLowerCase();
      let columnLength = this.getStringBetween(column['type'], '(', ')');
      let maxLength = this.getStringBetween(column['type'], '(', ',')
      let decimalPlaces = this.getStringBetween(column['type'], ',', ')')
      switch (columnType) {
        case 'datetime':
          columnString += `table.timestamp('${column['name']}')`;
          break;
        case 'integer':
        case 'numeric':
        case 'tinyint':
          columnString += column['pk'] === 1
            ? `table.increments('${column['name']}')`
            : (
              maxLength && decimalPlaces
                ? `table.decimal('${column['name']}', ${maxLength}, ${decimalPlaces})`
                : `table.integer('${column['name']}')`
            );
          break;
        case 'varchar':
          columnString += `table.string('${column['name']}'${columnLength ? `,${columnLength}` : ``})`;
          break;
        case 'text':
          columnString += `table.text('${column['name']}')`;
          break;
        case 'datetime':
          columnString += `table.datetime('${column['name']}')`;
          break;
        case 'boolean':
          columnString += `table.boolean('${column['name']}')`;
          break;
        default:
          columnString += `table.specificType('${column['name']}', '${columnType}')`;
      }
      //handle foreign key constraint
      columnString += column['pk'] == 1 ? `.primary()` : ``;
      columnString += indexes.find(s => s['unique'] == 1) ? `.unique()` : ``;
      columnString += indexes.find(s => s['name'].split('_').slice(-1)[0] == 'index') ? `.index()` : ``;
      columnString += column['dflt_value'] ? `.defaultTo(${column['dflt_value'] === 'CURRENT_TIMESTAMP' ? `Database.fn.now()` : `${column['dflt_value']}`})` : ``;
      columnString += column['notnull'] === 1 ? `` : `.nullable()`;
      columnString += `;\n\t\t\t\t\t`;
    });

    return columnString;

  }
}

module.exports = SQLite;
