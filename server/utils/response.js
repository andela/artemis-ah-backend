/**
* Helper method for sending response to the client.
* 
* @param {object} res The response object from the route
* @return {object} An object with methods for sending different type of responses (not found, forbidden, success, etc)
*/
export default (res) => {
  return {
    /**
    * Sends a status 403 and `data` to the client.
    * Should be sent when a request may be valid but the user 
    * doesn't have permissions to perform the action.
    * 
    * @param data
    */
    forbidden(data) {
      this.sendData(403, data);
    },

    /**
    * Sends a status 401 and `data` to the client.
    * Should be sent when a request required authentication but it is not provided.
    * 
    * @param data 
    */
    unauthorized(data) {
      this.sendData(401, data);
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
    notFound(data) {
      this.sendData(404, data);
    },

    /**
    * Send data to the client.
    * 
    * @access private
    * @param {integer} status 
    * @param {*} data 
    */
    sendData(status, data) {
      if (typeof data === 'string') {
        data = {
          message: data,
        };
      }
      res.status(status).json(data);
    },
  };
};
