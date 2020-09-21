'use strict'

class SoftDelete {
  register(Model, customOptions = {}) {
    const deletedAtColumn = customOptions.name || `deleted_at`;

    Model.addGlobalScope(builder => {
      builder.whereNull(deletedAtColumn);
    }, 'adonis_soft_deletes');

    Model.queryMacro('withTrashed', () => {
      this.ignoreScopes('adonis_soft_deletes');
      return this;
    });

    Model.queryMacro('onlyTrashed', () => {
      this.ignoreScopes('adonis_soft_deletes');
      this.whereNotNull(deletedAtColumn);
      return this;
    });

    Model.prototype.delete = async function () {
      this[deletedAtColumn] = new Date();
      await this.save();
    };

    Model.prototype.restore = async function () {
      this[deletedAtColumn] = null;
      await this.save();
    };

    Model.prototype.forceDelete = async function () {
      await Model.query()
        .where(Model.primaryKey, this[Model.primaryKey])
        .ignoreScopes()
        .delete();
    };
  }
}

module.exports = SoftDelete;
