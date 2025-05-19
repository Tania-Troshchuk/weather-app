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

  static weatherUpdate(data: {
    city: string;
    temperature: number;
    humidity: number;
    unsubscribeUrl?: string;
    description?: string;
  }): EmailContent {
    const { city, temperature, humidity, unsubscribeUrl, description } = data;
    return {
      subject: 'Weather updating',
      text: `
        <h2>Weather Update for ${city}</h2>
        <p>Temperature: ${temperature ?? 'N/A'}</p>
        <hr/>
        <p>Humidity: ${humidity ?? 'N/A'}</p>
        <hr/>
        ${description && `<p>Description: ${description ?? 'N/A'}</p><hr/>`}
        ${unsubscribeUrl && `<p><a href="${unsubscribeUrl}">Unsubscribe</a> from this subscription</p>`}
      `,
    };
  }
}
