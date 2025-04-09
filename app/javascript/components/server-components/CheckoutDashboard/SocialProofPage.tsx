import * as React from "react";
import { createCast } from "ts-safe-cast";

// import { PLACEHOLDER_CARD_PRODUCT, PLACEHOLDER_CART_ITEM } from "$app/utils/cart";
// import { asyncVoid } from "$app/utils/promise";
import { assertResponseError } from "$app/utils/request";
import { register } from "$app/utils/serverComponentUtil";

import { Button } from "$app/components/Button";
import { Layout, Page } from "$app/components/CheckoutDashboard/Layout";
import { Icon } from "$app/components/Icons";
import { useLoggedInUser } from "$app/components/LoggedInUser";
import { showAlert } from "$app/components/server-components/Alert";

const SocialProofPage = ({ pages = [] }: { pages?: Page[] }) => {
  const loggedInUser = useLoggedInUser();
  const [view, setView] = React.useState<"list" | "create" | "edit">("list");

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

  return view === "list" ? (
    <Layout
      currentPage="form"
      pages={pages}
      actions={
        <Button
          color="accent"
          onClick={() => setView("create")}
          disabled={!loggedInUser?.policies.checkout_form.update}
        >
          New social proof
        </Button>
      }
      hasAside
    >
      <section className="paragraphs">
        <h2 className="mb-4 text-lg font-medium">Social proof settings</h2>
        <p className="text-gray-500 text-sm">Configure your social proof settings to increase conversions.</p>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-md border p-4">
            <div>
              <h3 className="font-medium">Recent purchases</h3>
              <p className="text-gray-500 text-sm">Show recent purchases to increase trust</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setView("edit")}>
                <Icon name="pencil" />
                Edit
              </Button>
              <Button color="danger">
                <Icon name="trash2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  ) : view === "edit" ? (
    <Layout
      currentPage="form"
      pages={pages}
      actions={
        <>
          <Button onClick={() => setView("list")}>
            <Icon name="x-square" />
            Cancel
          </Button>
          <Button color="accent" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving changes..." : "Save changes"}
          </Button>
        </>
      }
    >
      <section className="paragraphs">
        <h2 className="mb-4 text-lg font-medium">Edit social proof</h2>
        <p className="text-gray-500 text-sm">Update your social proof settings.</p>

        <form className="mt-6 space-y-4">
          <fieldset>
            <legend>
              <label htmlFor="title">Title</label>
            </legend>
            <input type="text" id="title" placeholder="Recent purchases" defaultValue="Recent purchases" />
          </fieldset>

          <fieldset>
            <legend>
              <label htmlFor="display">Display settings</label>
            </legend>
            <select id="display">
              <option value="top">Top of page</option>
              <option value="bottom">Bottom of page</option>
              <option value="corner">Corner popup</option>
            </select>
          </fieldset>

          <fieldset>
            <legend>Configuration</legend>
            <label>
              <input type="checkbox" defaultChecked />
              Show customer name
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              Show product name
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              Show timestamp
            </label>
          </fieldset>
        </form>
      </section>
    </Layout>
  ) : (
    <Form title="Create widget" />
  );
};

export default register({ component: SocialProofPage, propParser: createCast() });

const Form = ({ title }: { title: string }) => {
  console.log("hello");
  return (
    <div className="fixed-aside" style={{ display: "contents" }}>
      <header className="sticky-top">
        <h1>{title}</h1>
        <div className="actions">
          <Button onClick={() => {}} disabled={false}>
            <Icon name="x-square" />
            Cancel
          </Button>
          <Button type="submit" color="accent" onClick={() => {}} disabled={false}>
            {false ? "Saving..." : "Save"}
          </Button>
        </div>
      </header>
      <main className="squished"></main>
    </div>
  );
};
