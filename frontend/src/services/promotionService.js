import api from "./api.js";

export const getPromotionPreview = async ({ currentSessionId, targetSessionId, fromClassId }) => {
  const { data } = await api.get("/promotions/preview", {
    params: { currentSessionId, targetSessionId, fromClassId },
  });
  return data.data;
};

export const executePromotion = async (payload) => {
  const { data } = await api.post("/promotions/execute", payload);
  return data;
};
