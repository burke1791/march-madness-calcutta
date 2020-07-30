var Pubsub = {};

(function(obj) {
  var obs = {};

  obj.publish = (notif, data) => {
    if (!obs[notif]) {
      return false;
    }

    let subs = obs[notif];

    for (var sub of subs) {
      sub.callback(data);
    }
  };

  obj.subscribe = (notif, sub, cb) => {
    if (!obs[notif]) {
      obs[notif] = [];
    }

    obs[notif].push({
      observer: sub,
      callback: cb
    });
  };

  obj.unsubscribe = (notif, sub) => {
    let subs = obs[notif];

    for (var i in subs) {
      if (subs[i].observer === sub) {
        subs.splice(i, 1);
        obs[notif] = subs;
        return;
      }
    }
  }
})(Pubsub);

export default Pubsub;