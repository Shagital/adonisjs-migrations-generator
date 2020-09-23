const fs = require('fs');

class MigrationsGenerator {
  constructor({database, include, exclude, path, connection, disableFkc}) {
    this.database = database;
    this.include = include;
    this.exclude = exclude;
    this.path = path;
    this.connection = connection;
    this.disableForeignKeyConstraint = disableFkc;
    this.tables = {};
    this.dbName = null;
    this.stubContent = '';

    return this;
  }

  async generateMigrationFiles() {
    var vm = this;

    // read stub content
    fs.readFile(`${__dirname}/stubs/migration.js.stub`, 'utf8', function (err, data) {
      if (err) {
        return console.error('Read Error:', err);
      }
      vm.stubContent = data;

      Object.keys(vm.tables).forEach(async (tableName) => {
        let contents = vm.generateMigrationContent(tableName);
        let migrationPath = `${vm.path}/${new Date().getTime()}_${tableName}.js`;

        fs.writeFile(migrationPath, contents, function (err) {
          if (err) {
            return console.error('Write Error:', err);
          }
          console.info(`Migration file saved to: ${migrationPath}`);
        });
      });
    });
  }


  getStringBetween(str, start, end) {
    return str.match(new RegExp(start+"(.*)"+end))[0];
  }

  snakeToPascal(str) {
    str += '';
    str = str.split('_');

    function upper(str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1, str.length);
    }


    for (let i = 0; i < str.length; i++) {
      var str2 = str[i].split('/');
      for (let j = 0; j < str2.length; j++) {
        str2[j] = upper(str2[j]);
      }
      str[i] = str2.join('');
    }
    return str.join('');
  }

  random(length = 10, numeric = false) {
    let result = '';
    let characters = numeric ? "1234567890" : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}

module.exports = MigrationsGenerator;
