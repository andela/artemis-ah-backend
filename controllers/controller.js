class Controller {
  response(res) {
    return {
      /**
       * Sends a status 403 and `data` to the client.
       * Should be sent when a request may be valid but the user 
       * doesn't have permissions to perform the action.
       * 
       * @param data
       */
      forbidden(message) {
        this.sendMessage(403, message);
      },

      /**
       * Sends a status 401 and `data` to the client.
       * Should be sent when a request required authentication but it is not provided.
       * 
       * @param data 
       */
      unauthorized(message) {
        this.sendMessage(401, message);
      },

      /**
       * Sends a status 200 and `data` to the client.
       * 
       * 
       * @param data 
       */
      success(data) {
        this.sendData(200, data);
      },

      /**
       * Sends a status 404 and `data` to the client.
       * Should be sent when a resource can't be found to fulfill the request.
       * 
       * @param data
       */
      notFound(message) {
        this.sendMessage(404, message);
      },

      /**
       * Send data to the client.
       * 
       * @access private
       * @param {integer} status 
       * @param {*} data 
       */
      sendData(status, data) {
        res.status(status).json({
          status,
          data,
        });
      },

      /**
       * Send a message back to the client.
       * 
       * @access private
       * @param {integer} status 
       * @param {*} message 
       */
      sendMessage(status, message) {
        res.status(status).json({
          status,
          message,
        });
      }
    };
  }
}

export default Controller;
