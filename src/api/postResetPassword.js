import axios from 'axios';

const resetPassword = async () => {
  const apiEndPoint = 'http://localhost:3000/auth/reset-password';
  const data = {
    resetToken: '29w080wf',
    newPassword: 'testingtesting123'
  };
  const headers = {
    Accept: 'text/html',
    'cache-control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Content-Type': 'application/json'
  };

  return await axios({
    method: 'post',
    url: apiEndPoint,
    headers: headers,
    data: data
  })
    .then((resp) => {
      return resp.data;
    })
    .catch((err) => {
      return err.message;
    });
};

export default resetPassword;
