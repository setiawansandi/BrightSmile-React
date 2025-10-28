// What it does: Shows a single user profile. Uses useUser(id) (from URL).

// // src/features/users/UserProfile.jsx
// import { useParams } from 'react-router-dom';
// import { useUser } from './useUsers.js';

// export default function UserProfile() {
//   const { id } = useParams();
//   const { data: user, loading, error } = useUser(id);

//   if (loading) return <p>Loading user…</p>;
//   if (error)   return <p style={{ color: 'crimson' }}>Error: {error.message}</p>;
//   if (!user)   return <p>User not found.</p>;

//   return (
//     <article>
//       <h2>{user.name}</h2>
//       <p><strong>Email:</strong> {user.email}</p>
//       {user.bio && <p>{user.bio}</p>}
//     </article>
//   );
// }