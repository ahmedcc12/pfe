import { Helmet } from 'react-helmet-async';

import { CreateUser } from 'src/sections/admin/users/Create-user';

// ----------------------------------------------------------------------

export default function CreateUserPage() {
  return (
    <>
      <Helmet>
        <title> Create User | Minimal UI </title>
      </Helmet>

      <CreateUser />
    </>
  );
}
