import { Helmet } from 'react-helmet-async';

import { AllActivityPage } from 'src/sections/admin/activity/view';

// ----------------------------------------------------------------------

export default function BotsPage() {
  return (
    <>
      <Helmet>
        <title> Activity | Minimal UI </title>
      </Helmet>

      <AllActivityPage />
    </>
  );
}
