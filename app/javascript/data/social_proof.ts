import { request } from "$app/utils/request";

export const createSocialProof = async () => {
  const response = await request({
    method: "POST",
    accept: "json",
    url: Routes.checkout_social_path(),
    data: {},
  });

  console.log(response);
  return response;
};
