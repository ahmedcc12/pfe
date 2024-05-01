import { Helmet } from 'react-helmet-async';

import { AdminMessagesPage } from 'src/sections/admin/adminMessages/view';

// ----------------------------------------------------------------------

export default function BotsPage() {
  return (
    <>
      <Helmet>
        <title> Messages | Minimal UI </title>
      </Helmet>

      <AdminMessagesPage />
    </>
  );
}
