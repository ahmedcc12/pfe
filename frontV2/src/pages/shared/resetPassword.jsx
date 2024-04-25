import { Helmet } from 'react-helmet-async';

import { ResetPassword } from 'src/sections/shared/password';

// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
  return (
    <>
      <Helmet>
        <title> ResetPassword | Minimal UI </title>
      </Helmet>

      <ResetPassword />
    </>
  );
}
