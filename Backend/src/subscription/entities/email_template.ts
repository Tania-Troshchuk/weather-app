interface EmailContent {
  subject: string;
  text: string;
}

export class EmailTemplates {
  static confirmSubscription(confirmUrl: string): EmailContent {
    return {
      subject: 'Confirm your subscription',
      text: `
        <h2>Confirm your weather subscription</h2>
        <p>Thank you for subscribing to our weather updates.</p>
        <p>Please confirm your subscription by clicking the link below:</p>
        <a href="${confirmUrl}">${confirmUrl}</a>
        <hr/>
        <p>If you didn’t request this, you can safely ignore this email.</p>
      `
    };
  }

  static weatherUpdate(
    city: string,
    temperature: number,
    humidity: number,
    unsubscribeUrl: string,
    description?: string,
  ): EmailContent {
    return {
      subject: 'Weather updating',
      text: `
        <h2>Weather Update for ${city}</h2>
        <p>Temperature: ${temperature ?? 'N/A'}</p>
        <hr/>
        <p>Humidity: ${humidity ?? 'N/A'}</p>
        <hr/>
        ${description && `<p>Description: ${description ?? 'N/A'}</p><hr/>`}
        <p><a href="${unsubscribeUrl}">Unsubscribe</a> from this subscription</p>
      `,
    };
  }

  static subscriptionConfirmed(): EmailContent {
    return {
      subject: 'Subscription confirmed',
      text: `
        <h2>Subscription Confirmed</h2>
        <p>Your subscription has been successfully confirmed. You will now receive weather updates as selected.</p>
      `,
    };
  }

  static unsubscribeConfirmation(): EmailContent {
    return {
      subject: 'Unsubscribe confirmed',
      text: `
        <h2>You've unsubscribed</h2>
        <p>You have successfully unsubscribed from our weather updates.</p>
      `,
    };
  }
}
