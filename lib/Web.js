var config = require('./Config');
var express = require('express');
var _ = require('lodash');

apnPusher = require('./APNPusher'),
gcmPusher = require('./GCMPusher');

var app = express();

// Middleware
app.use(express.compress());
app.use(express.bodyParser());

app.use(function(err, req, res, next) {
    res.status(500);
    res.render('error', { error: err });
});

app.post('/*', function (req, res, next) {
    if (req.is('application/json')) {
        next();
    }
});

app.post('/send', function (req, res) {
    var notifs = [req.body];

    var notificationsValid = sendNotifications(notifs);

    res.status(notificationsValid ? 200 : 400).send();
});

app.post('/sendBatch', function (req, res) {
    var notifs = req.body.notifications;

    var notificationsValid = sendNotifications(notifs);

    res.status(notificationsValid ? 200 : 400).send();
});

// Helpers
function sendNotifications(notifs) {
    var areNotificationsValid = _(notifs).map(validateNotification).min().value();

    if (!areNotificationsValid) return false;

    notifs.forEach(function (notif) {
        var tokens = notif.tokens,
            androidPayload = notif.android,
            iosPayload = notif.ios,
            target;

        if (tokens.length == 0) {
          return false;
        }

        if (androidPayload && iosPayload) {
            return false;
        } else if (iosPayload) {
          var apnPayload = apnPusher.buildPayload(iosPayload);
          apnPusher.push(tokens, apnPayload);
        } else if (androidPayload) {
          var gcmPayload = gcmPusher.buildPayload(androidPayload);
          gcmPusher.push(tokens, gcmPayload);
        }
    });

    return true;
}

function validateNotification(notif) {
    var valid = true;

    valid = valid && (!!notif.ios || !!notif.android);
    // TODO: validate content

    return valid;
}

exports.start = function () {
    app.listen(config.get('webPort'));
    console.log('Listening on port ' + config.get('webPort') + "...");
};
