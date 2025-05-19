import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase.from("subscription_plans").select("*");
      if (!error) {
        setPlans(data);
      }
      setLoading(false);
    };

    fetchPlans();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">باقات الاشتراك</h1>
      {loading ? (
        <p className="text-center">جاري التحميل...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded shadow p-4 text-center">
              <h2 className="text-xl font-bold text-green-600">{plan.title_ar}</h2>
              <p className="text-gray-700 mb-2">{plan.description_ar}</p>
              <p className="text-lg font-semibold text-black mb-4">{plan.price} د.ك / شهر</p>
              <ul className="text-right list-disc pr-4 mb-4">
                {plan.features_ar?.split("*").map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <button className="bg-green-600 text-white px-4 py-2 rounded">اشترك الآن</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}