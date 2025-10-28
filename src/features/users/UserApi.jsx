// // src/features/users/userApi.js
// const BASE_URL = '/api';

// export async function getUsers() {
//   const res = await fetch(`${BASE_URL}/users`);
//   if (!res.ok) throw new Error('Failed to load users');
//   return res.json();
// }

// export async function getUser(id) {
//   const res = await fetch(`${BASE_URL}/users/${id}`);
//   if (!res.ok) throw new Error('Failed to load user');
//   return res.json();
// }

// // (optional helpers)
// export async function createUser(payload) {
//   const res = await fetch(`${BASE_URL}/users`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload),
//   });
//   if (!res.ok) throw new Error('Failed to create user');
//   return res.json();
// }
