import { callAPI } from "./helpers";

export const signup = async (name: string, username: string, password: string) => {
  try {
    await callAPI('signup/', {
      method: 'POST',
      body: JSON.stringify({first_name: name, username, password})
    });
  } catch (e) {
    throw new Error('Failed to sign up');
  }
}


export const login = async (username: string, password: string) => {
  try {
    await callAPI('login/', {
      method: 'POST',
      body: JSON.stringify({username, password})
    });
  } catch (e) {
    throw new Error('Failed to log in');
  }
}


export const loginStatus = async (cookie: string) => {
  try {
    const res = await callAPI('login-status/', {
      header: {'cookie': cookie}
    });
    const data = await res.json();
    if (data.authenticated) {
      return data.authenticated;
    }
  } catch (e) {
    return false;
  }
  return false;
}