// What it does: Re-exports the public surface of the feature so other parts of the app can import from a single place.

// // src/features/users/index.js
// e.g
// export { default as UserList } from './UserList.jsx';
// export { default as UserProfile } from './UserProfile.jsx';
// export * from './useUsers.js';   // exports useUsers, useUser
// export * as userApi from './userApi.js';