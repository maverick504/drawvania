'use strict'

const send = async (triggererUser, notifiableUser, notificationTypeInstance) => {

  if(notificationTypeInstance.via().includes('database')) {
    const Notification = use('App/Models/Notification')

    const notification = new Notification()
    notification.triggerer_id = triggererUser.id
    notification.notifiable_id = notifiableUser.id
    notification.entity_id = notificationTypeInstance.entityId
    notification.entity_type = notificationTypeInstance.entityType
    notification.type = notificationTypeInstance.type()
    notification.metadata = notificationTypeInstance.metadata()
    await notification.save()
  }

  if(notificationTypeInstance.via().includes('email')) {
    const Env = use('Env')
    const Mail = use('Mail')

    const APP_FROM_TITLE = Env.get('APP_FROM_TITLE')
    const APP_FROM_EMAIL = Env.get('APP_FROM_EMAIL')

    await Mail.send('emails.notification', notificationTypeInstance.emailData(), (message) => {
      message.from(`${APP_FROM_TITLE} <${APP_FROM_EMAIL}>`)
      message.subject(notificationTypeInstance.emailSubject())
      message.to(notifiableUser.email)
    })
  }

}

module.exports = {
  send
}
