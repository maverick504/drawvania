'use strict'

class MiscellaneousController {

  async premiumLanding ({ view }) {
    return view.render('premium/landing')
  }

}

module.exports = MiscellaneousController
