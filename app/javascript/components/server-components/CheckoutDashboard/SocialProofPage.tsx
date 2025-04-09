import * as React from "react";
import { createCast } from "ts-safe-cast";

// import { PLACEHOLDER_CARD_PRODUCT, PLACEHOLDER_CART_ITEM } from "$app/utils/cart";
// import { asyncVoid } from "$app/utils/promise";
import { assertResponseError } from "$app/utils/request";
import { register } from "$app/utils/serverComponentUtil";

import { Button } from "$app/components/Button";
import { Layout, Page } from "$app/components/CheckoutDashboard/Layout";
import { useLoggedInUser } from "$app/components/LoggedInUser";
import { showAlert } from "$app/components/server-components/Alert";

const SocialProofPage = ({ pages = [] }: { pages?: Page[] }) => {
  const loggedInUser = useLoggedInUser();

  // const cartItem = PLACEHOLDER_CART_ITEM;
  // const cardProduct = PLACEHOLDER_CARD_PRODUCT;

  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    try {
      setIsSaving(true);
      showAlert("Changes saved!", "success");
    } catch (e) {
      assertResponseError(e);
      showAlert(e.message, "error");
    }
    setIsSaving(false);
  };

  return (
    <Layout
      currentPage="form"
      pages={pages}
      actions={
        <Button color="accent" onClick={handleSave} disabled={!loggedInUser?.policies.checkout_form.update || isSaving}>
          {isSaving ? "Saving changes..." : "Save changes"}
        </Button>
      }
      hasAside
    >
      <section className="paragraphs">
        <h2 className="mb-4 text-lg font-medium">Form settings</h2>
        <p className="text-gray-500 text-sm">Configure your checkout form settings here.</p>
        sargam poudel is good person
      </section>
    </Layout>
  );
};

export default register({ component: SocialProofPage, propParser: createCast() });
