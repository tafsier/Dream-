import React from "react";
import { useTranslation } from "react-i18next";

export default function SubmitDream() {
  const { t, i18n } = useTranslation();

  return (
    <div className="p-6">
      <h1>{t("submitDream.guidelines.title")}</h1>
      <ul>
        <li>{t("submitDream.guidelines.point1")}</li>
        <li>{t("submitDream.guidelines.point2")}</li>
        <li>{t("submitDream.guidelines.point3")}</li>
      </ul>

      <form className="mt-6">
        <textarea
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
          placeholder={t("submitDream.placeholder")}
          className="w-full border rounded p-2"
        ></textarea>
      </form>
    </div>
  );
}