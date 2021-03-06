const MigrationGenerator = require(`${__dirname}/../MigrationsGenerator`);

class PostgreSql extends MigrationGenerator {
  constructor(props) {
    super(props);
    this.dbType = props.dbType;
    this.exclude = this.exclude.concat([]);
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

    let queryResults = await this.database.raw(`
    SELECT
    table_schema || '.' || table_name
FROM
    information_schema.tables
WHERE
    table_type = 'BASE TABLE'
AND
    table_schema NOT IN ('pg_catalog', 'information_schema');
    `);

    console.info(`Excluding tables`, this.exclude);

    Object.values(queryResults['rows']).forEach(table => {
      let tableName = table['?column?'].split('.')[1];
      if (!this.exclude.includes(tableName)) {
        this.tables[tableName] = {};
      }
    });

    return this;
  }

  async tableColumns() {
    let tables = this.tables;
    //TODO: Find a way to run query oncce instead of within loop
    for (let tableName in tables) {
      let tableColumnsQuery = await this.database.raw(`
      SELECT
   *
FROM
   information_schema.columns
WHERE
   table_name = '${tableName}';
      `);

      let tableColumns = tableColumnsQuery['rows'];

      let indexQuery = await this.database.raw(`
 select
    t.relname as table_name,
    i.relname as index_name,
    array_to_string(array_agg(a.attname), ', ') as column_names
from
    pg_class t,
    pg_class i,
    pg_index ix,
    pg_attribute a
where
    t.oid = ix.indrelid
    and i.oid = ix.indexrelid
    and a.attrelid = t.oid
    and a.attnum = ANY(ix.indkey)
    and t.relkind = 'r'
    and t.relname like '${tableName}%'
group by
    t.relname,
    i.relname
order by
    t.relname,
    i.relname;
      `);

      let indexes = indexQuery['rows'];

      let foreignKeysQuery = await this.database.raw(`
      SELECT

    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='${tableName}';
      `);

      indexes = indexes.concat(foreignKeysQuery['rows']);

      Object.keys(tableColumns).forEach(key => {
        let tableColumn = tableColumns[key];
        this.tables[tableName][tableColumn.column_name] = tableColumn;
        this.tables[tableName][tableColumn.column_name]['indexes'] = indexes;
      });


    }


    return this;

  }

  async connectDb() {
    let query = await this.database.raw('SELECT current_database();');
    this.dbName = query['rows'][0]['current_database'];
    console.log(`DB Name: ${this.dbName}`);
  }

  generateMigrationContent(tableName) {
   console.info(`Generating migration file for table: ${tableName}`);

    let columnString = this.generateColumns(this.tables[tableName]);

    let pascalTableName = this.snakeToPascal(tableName);

    //TODO: Find a way to run migrations without foreign keys in no particular order
    return this.stubContent
      .replace(new RegExp(`{{disableforeignKeyConstraint}}`, 'g'), this.disableForeignKeyConstraint
        ? ``
        : ``
      )
      .replace(new RegExp(`{{enableforeignKeyConstraint}}`, 'g'), this.disableForeignKeyConstraint
        ? ``
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

    console.warn('You might need to change the name of the migration files so as to modify execution order in case of foreign keys');
  }

  generateColumns(columns) {
    let columnString = "\t\t\t";

    Object.keys(columns).forEach(columnName => {
      let column = columns[columnName];
      let indexes = column['indexes'];

      let columnType = column['data_type'].split(' ')[0];
      switch (columnType) {
        case 'uuid':
          columnString += `table.uuid('${column['column_name']}')`;
          break;
        case 'bigint':
          columnString += column['column_default'] && column['column_default'].includes(`${column['table_name']}_${column['column_id']}_seq`)
            ? `table.increments('${column['column_name']}')`
            : `table.bigInteger('${column['column_name']}', ${column['numeric_precision']})`;
          break;
        case 'numeric':
        case 'smallint':
          if (column['column_default'] && column['column_default'].includes(`${column['table_name']}_${column['column_id']}_seq`)) {
            columnString += `table.increments('${column['column_name']}')`
          } else {
            if (column['numeric_scale'] > 0)
              columnString += `table.decimal('${column['column_name']}', ${column['numeric_precision']}, ${column['numeric_scale']})`;
            else
              columnString += `table.integer('${column['column_name']}', ${column['numeric_precision']})`
          }
          break;
        case 'character':
          columnString += `table.string('${column['column_name']}', ${column['character_maximum_length']})`;
          break;
        case 'timestamp':
          columnString += `table.timestamp('${column['column_name']}')`;
          break;
        case 'date':
          columnString += `table.date('${column['column_name']}')`;
          break;
        case 'boolean':
          columnString += `table.boolean('${column['column_name']}')`;
          break;
        case 'decimal':
          columnString += `table.decimal('${column['column_name']}', ${column['numeric_precision']}, ${column['NUMERIC_SCALE']})`;
          break;
        default:
          columnString += `table.specificType('${column['column_name']}', '${columnType}')`;
      }

      columnString += column['is_nullable'] === 'YES' ? `.nullable()` : ``;
      if (column['column_default'] && !column['column_default'].includes(`${column['table_name']}_${column['column_name']}_seq`)) {
        let defaultValue = column['column_default'].includes('::')
          ? this.getStringBetween(column['column_default'], "'", "'")
          : column['column_default'];

        columnString += `.defaultTo(${defaultValue})`;
      }

      columnString += indexes.find(s => s['column_names'] === column['column_name'] && s['index_name'] && s['index_name'].split('_').slice(-1)[0] === 'unique') ? `.unique()` : ``;
      columnString += indexes.find(s => s['column_names'] === column['column_name'] && s['index_name'] && s['index_name'].split('_').slice(-1)[0] === 'pkey') ? `.primary()` : ``;
      let index = indexes.find(s => s['index_name'] && s['index_name'].split('_').slice(-1)[0] === 'index');
      if (index) {
        columnString += `.index(['${index['column_names'].split(',').join("','")}'], '${index['index_name'].substr(-25)}_${this.random(2, true)}')`;
      }

      Object.values(indexes).forEach(value => {
        if (value['foreign_table_name'] && value['column_name'] === column['column_name']) {
          columnString += `.references('${value['foreign_column_name']}').inTable('${value['foreign_table_name']}').withKeyName('${value['constraint_name'].substr(-25)}_${this.random(2, true)}')`;
        }
      });

      columnString += `;\n\t\t\t\t\t`;
    });
    return columnString;

  }
}

module.exports = PostgreSql;
