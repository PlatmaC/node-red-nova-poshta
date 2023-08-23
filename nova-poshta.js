module.exports = function (RED) {
  const axios = require('axios');
  const NOVAPOSHTA_URI = 'https://api.novaposhta.ua/v2.0/json/';
  function NovaPoshta(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.on('input', function (msg, nodeSend, nodeDone) {
      if (!msg.npTTN) {
        node.error(RED._('novaposhta-track.errors.no-ttn'), msg);
        node.status({ fill: 'red', shape: 'dot', text: 'Error. No ttn' });
        nodeDone();
        return;
      }

      if (!msg.npPhone) {
        node.warn(RED._('novaposhta-track.warning.no-phone-number'));
      }

      if (!config.apikey) {
        node.error(RED._('novaposhta-track.errors.no-apikey'));
        node.status({ fill: 'red', shape: 'dot', text: 'Error. No apikey' });
        nodeDone();
        return;
      }

      node.status({
        fill: 'blue',
        shape: 'dot',
        text: 'http-request-np.status.requesting',
      });

      axios({
        method: 'post',
        url: NOVAPOSHTA_URI,
        headers: config.headers,
        data: {
          apiKey: config.apikey,
          modelName: 'TrackingDocument',
          calledMethod: 'getStatusDocuments',
          methodProperties: {
            Documents: [
              {
                DocumentNumber: msg.npTTN,
                Phone: msg.npPhone || '',
              },
            ],
          },
        },
      })
        .then((res) => {
          msg.statusCode = res.status;
          const body = res.data;
          msg.payload = {
            success: body.success,
            deliveryStatus:
              body?.data && Array.isArray(body.data) && body.data.length === 1
                ? body.data[0].Status
                : null,
            data:
              body?.data && Array.isArray(body.data) && body.data.length === 1
                ? body.data[0]
                : body.data,
            rawResponse: body,
          };

          node.status({});
          nodeSend(msg);
          nodeDone();
        })
        .catch((err) => {
          if (err.code === 'ETIMEDOUT' || err.code === 'ESOCKETTIMEDOUT') {
            node.error(RED._('common.notification.errors.no-response'), msg);
            node.status({
              fill: 'red',
              shape: 'ring',
              text: 'common.notification.errors.no-response',
            });
          } else {
            node.error(err, msg);
            node.status({ fill: 'red', shape: 'ring', text: err.code });
          }
          msg.payload = err.toString();
          msg.statusCode =
            err.code || (err.response ? err.response.statusCode : undefined);

          if (!config.senderr) {
            nodeSend(msg);
          }
          nodeDone();
        });
    });

    node.on('close', function () {
      node.status({});
    });
  }
  RED.nodes.registerType('novaposhta-track', NovaPoshta);
};
