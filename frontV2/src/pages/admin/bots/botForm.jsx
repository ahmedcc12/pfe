import { Helmet } from 'react-helmet-async';

import { CreateBot } from 'src/sections/admin/bots/createBot';

// ----------------------------------------------------------------------

export default function BotsPage() {
  return (
    <>
      <Helmet>
        <title> Create Bot | Minimal UI </title>
      </Helmet>

      <CreateBot />
    </>
  );
}
