import { Helmet } from 'react-helmet-async';

import { CreateGroup } from 'src/sections/admin/groups/createGroup';

// ----------------------------------------------------------------------

export default function CreateUserPage() {
  return (
    <>
      <Helmet>
        <title> Create User | Minimal UI </title>
      </Helmet>

      <CreateGroup />
    </>
  );
}
