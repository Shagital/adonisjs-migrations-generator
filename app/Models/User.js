'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot();
    this.addTrait('SoftDelete')
    this.addTrait('Timezone')

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
      if (userInstance.dirty.meta) {
        userInstance.meta = JSON.stringify(userInstance.meta, null, 4);
      }
    })
  }

  static get hidden () {
    return ['password', 'deleted_at']
  }

  static get dates () {
    return super.dates.concat(['creation_date'])
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  feedbacks () {
    return this.hasMany('App/Models/Feedback', 'id', 'user_id');
  }

  oauth () {
    return this.hasOne('App/Models/Oauth', 'id', 'user_id');
  }
}

module.exports = User
