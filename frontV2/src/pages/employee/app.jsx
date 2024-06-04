import { Helmet } from 'react-helmet-async';

import { AppView } from 'src/sections/employee/homepage/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Home | Minimal UI </title>
      </Helmet>

      <AppView />
    </>
  );
}
