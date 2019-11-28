'use strict'

class PullController {

  async index({ request, auth }) {
    const since = auth.user.last_notifications_request || new Date(0)

    return await auth.user.notifications()
    .count('notifications.id AS new_notifications')
    .where('created_at', '>', since)
    .first()
  }

}

module.exports = PullController
