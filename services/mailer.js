const sendgrid = require('sendgrid');
const mongoose = require('mongoose');

const helper = sendgrid.mail;
const keys = require('../config/keys')

class Mailer extends helper.Mail {
    constructor( { subject, recipients }, content) {
      super();

      //the address which is sending the email
      this.sgApi = sendgrid(keys.sendgridKey);
      this.from_email = new helper.Email(keys.sendgridEmail);
      this.subject = subject;
      this.body = new helper.Content('text/html', content);
      this.recipients = this.formatAddresses(recipients);

      this.addContent(this.body);
      this.addClickTracking();
      this.addRecipients();
    }

    formatAddresses(recipients) {
      //create an email object from the array of recipient objects
      return recipients.map( ({ email }) => {
        return new helper.Email(email);
      });
    }

    //per sendgrid documentation
    //init tracking and tracking settings objects
    addClickTracking () {
      const trackingSettings = new helper.TrackingSettings();
      const clickTracking = new helper.ClickTracking(true, true);

      trackingSettings.setClickTracking(clickTracking);
      this.addTrackingSettings(trackingSettings);
    }

    addRecipients (recipients) {
      const personalize = new helper.Personalization();
      this.recipients.forEach(recipient => {
        personalize.addTo(recipient);
      });
      this.addPersonalization(personalize);
    }

  async send() {
    const request = this.sgApi.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: this.toJSON()
    });

    const response = await this.sgApi.API(request);
  }
}

module.exports = Mailer;
