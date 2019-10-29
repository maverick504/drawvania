'use strict'

class AnnouncementController {

  async index ({ view }) {
    return view.render('admin/announcements/index')
  }

}

module.exports = AnnouncementController
