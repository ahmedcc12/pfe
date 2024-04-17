import { Helmet } from 'react-helmet-async';

import { UserBotsView } from 'src/sections/user/bots/botsList/view';

// ----------------------------------------------------------------------

export default function BotsPage() {
  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <UserBotsView />
    </>
  );
}
