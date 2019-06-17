const config = require('config.json');
const mustache = require('mustache');
const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');
const nodemailer = require('nodemailer');

module.exports = {
  getUserStatus,
  getApiUrl,
  getDomain,
  sendEmail
};

function getUserStatus() {
  return {
    ACTIVE: 'ACTIVE',
    DEACTIVATED: 'DEACTIVATED',
    PENDING: 'PENDING',
    LOCKED: 'LOCKED'
  }
}

function getApiUrl(req) {
  return req.protocol + '://' + req.get('host') + '/api';
}

function getDomain(req) {
  return req.protocol + '://' + req.get('host');
}

async function sendEmail(to, subject, template, dataTemplate) {

  const tmp = fs.readFileSync(path.join(__dirname, '../emails/', template), 'utf-8');

  const html = mustache.render(tmp, dataTemplate);

  // let emailOptions = config.defaultEmailOptions;

  // copy message properties to email
  // Object.assign(emailOptions.body.message, {
  //   to: to,
  //   subject: subject,
  //   html: html
  // });

  // let results = await request(emailOptions);
  //
  // const { status } = results[0];
  // if (status && (status === 'sent' || status === 'queued')) {
  //   return results[0];
  // } else {
  //   throw "Error sending email.";
  // }

  const transporter = nodemailer.createTransport(config.emailOption);
  await transporter.sendMail({
    from: 'man.trandm@watasolutions.com',
    to: to[0].email,
    subject,
    html
  }, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}
