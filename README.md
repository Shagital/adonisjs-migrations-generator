# AdonisJS Migrations Generator
![npm](https://img.shields.io/npm/dt/@shagital/adonisjs-migrations-generator?style=plastic)
![npm (scoped)](https://img.shields.io/npm/v/@shagital/adonisjs-migrations-generator)
![NPM](https://img.shields.io/npm/l/@shagital/adonisjs-migrations-generator)

This package allows you easily generate migration files for your adonisJS app from an existing Database, including indexes and foreign keys!

## Curently Supported
- MySQL
- SQLite

## Installation

You can install the package via composer:
``` bash
npm install @shagital/adonisjs-migrations-generator
```
Or with yarn
``` bash
yarn add @shagital/adonisjs-migrations-generator
```

### Usage
Open `start/app.js` and add `@shagital/adonisjs-migrations-generator/src/Command/MigrationsGeneratorCommand` to the commands array

- Note that you can replace the `adonis` with `node ace` if adonis is not installed globally on your system.

#### Basic usage
Will generate migration files for all tables in the DB set as default, and save files in `databases/migrations` directory
```bash
adonis migration:generate
```

#### Specify tables to generate migrations for
```bash
adonis migration:generate  --include=table1,table2
```

### Exclude specific tables
```bash
adonis migration:generate  --exclude=table1,table2
```

### Specify DB connection to use
>NOTE: Connection type must have been specified in `config/databases`
```bash
adonis migration:generate  --connection=mysql2
```

### Save migration files in specified path
>NOTE: The package will attempt to create the specified directory if it doesn't exist
```bash
adonis migration:generate  --path=/var/www/html/backups
```

### Clear directory before creating migration files.
This option is suitable for a fresh application install
>![#f03c15](https://via.placeholder.com/15/f03c15/000000?text=+) NOTE: 
The directory and all it's content will be deleted before the directory is recreated! ENSURE THE DIRECTORY DOESN'T CONTAIN FILES YOU PREFER TO KEEP!!!
```bash
adonis migration:generate --force
```

### Disable foreign key constraint in migration files
>[MySQL/PostgreSQL] Because we're generating migrations are being generated from an existing DB, when you run the migration, you might run into foreign key constraint errors because tables might not be created before been referenced in another table. This option adds a command to disable foreign key check so your migrations can run smoothly
```bash
adonis migration:generate --disable-fkc
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## Contributing

If you have a feature you'd like to add, kindly send a Pull Request (PR)

## Security

If you discover any security related issues, please email [zacchaeus@shagital.com](mailto:zacchaeus@shagital.com) instead of using the issue tracker.

## Credits
- [Zacchaeus Bolaji](https://github.com/djunehor)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
