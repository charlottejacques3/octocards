export const signup = async (name: string, username: string, password: string) => {
  const res = await fetch('http://localhost:8000/signup/', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({first_name: name, username: username, password:password})
  });
  console.log(res);
  if (!res.ok) {
    throw new Error('Failed to sign up');
  }
}


export const login = async (username: string, password: string) => {
  const res = await fetch('http://localhost:8000/login/', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({username, password})
  });
  console.log(res);
  if (!res.ok) {
    throw new Error('Failed to log in');
  }
}


export const loginStatus = async (cookie: string) => {
  const res = await fetch('http://localhost:8000/login-status/', {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      cookie
    },
  });
  const data = await res.json();
  console.log(data.authenticated);
  if (data.authenticated) {
    return data.authenticated;
  }
  return false;
}