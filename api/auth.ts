import { callAPI } from "./helpers";

export const signup = async (name: string, username: string, password: string) => {
  try {
    await callAPI('signup/', {
      method: 'POST',
      body: JSON.stringify({first_name: name, username, password})
    });
  } catch (e) {
    const err = e as Error;
    const message = err.cause === 400 ? 'The username already exists' : 'Something went wrong. Please try again';
    throw new Error(message);
  }
}


export const login = async (username: string, password: string) => {
  try {
    await callAPI('login/', {
      method: 'POST',
      body: JSON.stringify({username, password})
    });
  } catch (e) {
    const err = e as Error;
    const message = err.cause === 400 ? 'Username or password is incorrect' : 'Something went wrong. Please try again';
    throw new Error(message);
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


export const me = async (cookie: string) => {
  try {
    const res = await callAPI('login-status/', {
      header: {'cookie': cookie}
    });
    const data = await res.json();
    if (data.user) {
      return data.user;
    }
  } catch (e) {
    throw new Error('User not found');
  }
}