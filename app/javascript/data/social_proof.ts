import { request } from "$app/utils/request";

type SocialProofPlayload = {
  name: string;
  title: string;
  description: string;
  cta_text: string;
  cta_type: "button" | "link" | "none";
  image_type: "product" | "custom" | "icon" | "none";
  icon: string;
  icon_color: string;
  selected_product_ids: string[];
  universal: boolean;
};

export const createSocialProof = async (payload: SocialProofPlayload) => {
  const response = await request({
    method: "POST",
    accept: "json",
    url: Routes.checkout_social_path(),
    data: payload,
  });

  return response;
};
