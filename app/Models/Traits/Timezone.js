'use strict'
const moment = use('moment');

class Timezone {
  register(Model, options) {
    Model.formatDates = (field, value) => {
      let dates = ['created_at', 'updated_at', 'deleted_at'];
      if (dates.includes(field)) {
        return moment(value).utc().format('YYYY-MM-DD HH:mm:ss')
      }
      return super.formatDates(field, value)
    }
  }
}


module.exports = Timezone
