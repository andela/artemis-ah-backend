import { HelperUtils } from '../utils';
import response from '../utils/response';

const Auth = async (req, res, next) => {
  const token = req.headers['x-access-token'];
  try {
    if (!token) {
      response(res).unauthorized({ message: 'unauthorized' });
    }

    const decoded = await HelperUtils.verifyToken(token);
    req.username = decoded.username;

    return next();
  } catch (err) {
    response(res).unauthorized({ message: err.message });
  }
};

export default Auth;
