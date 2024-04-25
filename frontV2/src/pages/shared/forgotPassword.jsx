import { Helmet } from 'react-helmet-async';

import { ForgotPassword } from 'src/sections/shared/password';

// ----------------------------------------------------------------------

export default function ForgotPasswordPage() {
  return (
    <>
      <Helmet>
        <title> ForgotPassword | Minimal UI </title>
      </Helmet>

      <ForgotPassword />
    </>
  );
}
