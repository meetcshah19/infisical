import { useTranslation } from "react-i18next";
import Head from "next/head";

import { UserSecretsPage } from "@app/views/UserSecretsPage";

const UserSettings = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("common.head-title", { title: "User Secrets" })}</title>
        <link rel="icon" href="/infisical.ico" />
        <meta property="og:image" content="/images/message.png" />
        <meta property="og:title" content={String("Local User Secrets")} />
        <meta name="og:description" content={String("Store secrets locally")} />
      </Head>
      <div className="h-full">
        <UserSecretsPage />
      </div>
    </>
  );
};

export default UserSettings;

UserSettings.requireAuth = true;
