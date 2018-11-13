const promotions = {};

function randomString(len, charSet) {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var randomStr = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomStr += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomStr.toUpperCase();
};

function randomPromotion() {
  if (Math.random() < .05) {
    const keys = Object.keys(promotions);
    const code = keys[Math.floor(Math.random() * keys.length)];
    return { [code]: promotions[code] };
  }
  return null;
};
for (let i = 0; i < 10; i++) {
  promotions[randomString(6)] = { time: (Math.floor(Math.random() * 5) + 1) * 30 * 60 * 1000 }
}

var EventController = function () { };

EventController.prototype.start = function (req, res) {
  var query,
    data,
    simulation,
    start,
    end,
    count,
    randomDate,
    randomPlate;

  end = new Date();
  start = new Date(end.getTime() - (24 * 60 * 60 * 1000));
  start.setHours(0);
  start.setMinutes(0);
  start.setSeconds(0);
  end.setHours(0);
  end.setMinutes(0);
  end.setSeconds(0);

  randomDate = function (from, to) {
    from = from.getTime();
    to = to.getTime();
    return new Date(from + Math.random() * (to - from));
  };

  query = new Promise(function (resolve) {
    data = [];
    for (var i = start.valueOf(); i < end.valueOf(); i += (1000 * 60)) {
      count = Math.floor(Math.random() * (3 - 0)) + 0;
      for (var j = 0; j < count; j++) {
        data.push({
          in: new Date(i).valueOf(),
          out: randomDate(new Date(i), end).valueOf(),
          license: randomString(6),
          promotion: randomPromotion()
        })
      }
    }
    resolve(data);
  }).then(function (data) {
    res.json(data);
  });

};

module.exports = EventController;
