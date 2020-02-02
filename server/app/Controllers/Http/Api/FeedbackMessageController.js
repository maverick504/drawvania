'use strict'

const { validateAll } = use('Validator')
const FeedbackMessage = use('App/Models/FeedbackMessage')

class FeedbackController {

  async store({ request, auth, response }) {
    const rules = {
      type: `required|in:challenge-suggestion,tutorial-category-suggestion,other-suggestion,bug-report,feature-request,other`,
      details: `required|string|max:500`,
      origin_url: `required`
    }

    const { type, details, origin_url } = request.only([ 'type', 'details', 'origin_url' ])

    // Validate the fields in the request
    const validation = await validateAll({ type, details, origin_url }, rules)

    if (!validation.fails()) {
      try {
        const message = new FeedbackMessage()
        message.author_id = auth.user.id
        message.type = type
        message.details = details
        message.origin_url = origin_url
        message.metadata = {}
        await message.save()

        // Return a success message
        return response.json({
          status: 'success',
          data: message
        })
      } catch(error) {
        console.log(error)
        return response.status(400).json({
          status: 'error',
          message: 'Something went wrong, please try again.'
        })
      }
    } else {
      response.status(400).send(validation.messages())
    }
  }

}

module.exports = FeedbackController
