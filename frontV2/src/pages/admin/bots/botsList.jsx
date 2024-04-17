import { Helmet } from 'react-helmet-async';

import { BotsView } from 'src/sections/admin/bots/botsList/view';

// ----------------------------------------------------------------------

export default function BotsPage() {
  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <BotsView />
    </>
  );
}
