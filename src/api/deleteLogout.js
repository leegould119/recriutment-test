import axios from 'axios';

const logoutUser = async () => {
  const apiEndPoint = 'http://localhost:3000/auth/logout';
  const data = {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjQ3OTkwOGM4NjNlNTAyYTA4NjJmY2EiLCJpYXQiOjE1OTg1Mjk3OTd9.HNok0mbxIt4AxhwUoYVU3XV4Pmw9QyfTnUPTGy3LDF0'
  };
  const headers = {
    Accept: 'text/html',
    'cache-control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Content-Type': 'application/json'
  };

  return await axios({
    method: 'delete',
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

export default logoutUser;
