import React from "react";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t("dashboard.title")}</h1>
      <p>{t("dashboard.description")}</p>
    </div>
  );
}