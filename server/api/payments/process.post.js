export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  // Validate required fields
  if (!body.order_id || !body.amount) {
    throw createI18nError({
      statusCode: 400,
      i18nKey: 'errors.paymentInfoMissing',
      statusMessage: 'Missing required payment information'
    })
  }

  try {
    // This is a mock payment processor
    // In a real application, you would integrate with Stripe, PayPal, etc.

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock payment validation
    if (body.card && body.card.number === '4000000000000002') {
      // Simulate declined card — wrap so the catch block can pick up the i18n key
      const declineErr = new Error('Your card was declined. Please try a different payment method.')
      declineErr.i18nKey = 'errors.paymentCardDeclined'
      throw declineErr
    }

    if (body.card && body.card.cvv === '000') {
      // Simulate invalid CVV
      const cvvErr = new Error('Invalid security code. Please check your CVV and try again.')
      cvvErr.i18nKey = 'errors.paymentInvalidCvv'
      throw cvvErr
    }

    // Generate mock transaction ID
    const transactionId = 'txn_' + Math.random().toString(36).substr(2, 9)

    // Mock successful payment response
    return {
      success: true,
      transaction_id: transactionId,
      amount: body.amount,
      currency: 'USD',
      status: 'completed',
      i18nKey: 'errors.paymentSuccess',
      message: 'Payment processed successfully'
    }

  } catch (error) {
    console.error('Payment processing error:', error)

    return {
      success: false,
      i18nKey: error.i18nKey || 'errors.paymentFailed',
      message: error.message || 'Payment processing failed. Please try again.'
    }
  }
})
