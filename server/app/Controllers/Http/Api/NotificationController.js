'use strict'

const User = use('App/Models/User')

class NotificationController {

  async index({ request, auth }) {
    const notifications = await auth.user.notifications()
    .with('triggerer')
    .with('entity')
    .paginate(request.get().page, 10)

    for(let i = 0; i < notifications.rows.length; i++) {
      const entity = notifications.rows[i].$relations.entity

      if(!entity) {
        notifications.rows.splice(i, 1)
        i--
      } else {
        switch(notifications.rows[i].entity_type) {
          case 'App/Models/Post':
            if(!entity.getRelated('media')) {
              await entity.load('media')
            }
            break
          case 'App/Models/PostComment':
            if(!entity.getRelated('post')) {
              await entity.loadMany([ 'post', 'post.media' ])
            }
            break
        }
      }
    }

    // Save request time.
    auth.user.last_notifications_request = new Date()
    await auth.user.save()

    return notifications
  }

  async markAsRead({ params, auth, response }) {
    const notification = await auth.user.notifications().where('id', '=', params.id).firstOrFail()

    try {
      notification.read_at = new Date()
      await notification.save()

      // Return a success message
      return response.json({
        status: 'success'
      })
    } catch(error) {
      return response.status(400).json({
        status: 'error',
        message: 'Something went wrong, please try again.'
      })
    }
  }

}

module.exports = NotificationController
