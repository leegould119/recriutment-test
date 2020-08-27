import axios from 'axios';

const refreshAccessToken = async () => {
  const apiEndPoint = 'http://localhost:3000/auth/token';
  const data = {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjQ3OTkwOGM4NjNlNTAyYTA4NjJmY2EiLCJpYXQiOjE1OTg1MzI3MDF9.WQYV3o-LpbTUMTPLVpu9mLHzv_vPsPD0CyOmEuGvoZE'
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

export default refreshAccessToken;
