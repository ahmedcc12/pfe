import { Helmet } from 'react-helmet-async';

import { UserView } from 'src/sections/admin/users/usersList/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <UserView />
    </>
  );
}
