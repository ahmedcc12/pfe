import { Helmet } from 'react-helmet-async';

import { GroupsView } from 'src/sections/admin/groups/groupsList/view';

// ----------------------------------------------------------------------

export default function GroupsPage() {
  return (
    <>
      <Helmet>
        <title> Groups | Minimal UI </title>
      </Helmet>

      <GroupsView />
    </>
  );
}
