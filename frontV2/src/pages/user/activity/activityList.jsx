import { Helmet } from 'react-helmet-async';

import { UserActivityPage } from 'src/sections/user/activity/view';

// ----------------------------------------------------------------------

export default function BotsPage() {
  return (
    <>
      <Helmet>
        <title> Activity | Minimal UI </title>
      </Helmet>

      <UserActivityPage />
    </>
  );
}
