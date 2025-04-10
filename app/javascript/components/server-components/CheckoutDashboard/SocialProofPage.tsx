import cx from "classnames";
import * as React from "react";
import { createCast } from "ts-safe-cast";

// import { PLACEHOLDER_CARD_PRODUCT, PLACEHOLDER_CART_ITEM } from "$app/utils/cart";
// import { asyncVoid } from "$app/utils/promise";
import { Thumbnail } from "$app/data/thumbnails";
import { assertResponseError } from "$app/utils/request";
import { register } from "$app/utils/serverComponentUtil";

// import { useBundleEditContext } from "$app/components/BundleEdit/state";
import { Button } from "$app/components/Button";
import { SocialProofCard } from "$app/components/Checkout/SocialProofCard";
import { Layout, Page } from "$app/components/CheckoutDashboard/Layout";
import { Icon } from "$app/components/Icons";
import { useLoggedInUser } from "$app/components/LoggedInUser";
// import { coverUrlForThumbnail } from "$app/components/ProductEdit/ProductTab/ThumbnailEditor";
import { ThumbnailEditor } from "$app/components/ProductEdit/ProductTab/ThumbnailEditor";
import { Select } from "$app/components/Select";
import { showAlert } from "$app/components/server-components/Alert";
import { WithTooltip } from "$app/components/WithTooltip";
// const nativeTypeThumbnails = require.context("$assets/images/native_types/thumbnails/");

const SocialProofPage = ({ pages = [], products }: { pages?: Page[]; products: Product[] }) => {
  const loggedInUser = useLoggedInUser();
  // TODO: @sargam remove this
  const [view, setView] = React.useState<"list" | "create" | "edit">("create");

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
    <Form title="Create widget" products={products} />
  );
};

export default register({ component: SocialProofPage, propParser: createCast() });

type Product = {
  id: string;
  name: string;
  url: string;
  is_tiered_membership: boolean;
  archived: boolean;
};

const Form = ({ title, products }: { title: string; products: Product[] }) => {
  // const { bundle } = useBundleEditContext();
  // const { covers } = bundle;
  // const nativeType = "bundle";

  const [name, setName] = React.useState("");
  const [titleText, setTitleText] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [ctaText, setCtaText] = React.useState("");

  const [image, setImage] = React.useState<{ id: string; label: string }>({ id: "product", label: "Product image" });
  const [thumbnail, setThumbnail] = React.useState<Thumbnail | null>(null);

  const [selectedProductIds, setSelectedProductIds] = React.useState<{ value: string[]; error?: boolean }>({
    value: [],
  });
  const selectedProducts = products.filter(({ id }) => selectedProductIds.value.includes(id));
  const [universal, setUniversal] = React.useState(false);

  const uid = React.useId();
  return (
    <div className="fixed-aside" style={{ display: "contents" }}>
      <header className="sticky-top">
        <h1>{title}</h1>
        <div className="actions">
          <Button onClick={() => {}} disabled={false}>
            <Icon name="x-square" />
            Cancel
          </Button>
          <Button type="submit" color="black" onClick={() => {}} disabled={false}>
            {false ? "Saving..." : "Save"}
          </Button>
          <Button color="accent">Publish</Button>
        </div>
      </header>
      <main className="squished">
        <form>
          <section className="paragraphs">
            <fieldset className={cx({ danger: false })}>
              <legend>
                <label htmlFor="name">Widget name</label>
              </legend>
              <input
                type="text"
                id="name"
                placeholder="Community members"
                value={name}
                onChange={(evt) => setName(evt.target.value)}
                aria-invalid={false}
              />
            </fieldset>
            <fieldset className={cx({ danger: selectedProductIds.error })}>
              <legend>
                <label htmlFor={`${uid}products`}>Products</label>
              </legend>
              <Select
                inputId={`${uid}products`}
                instanceId={`${uid}products`}
                options={products
                  .filter((product) => !product.archived)
                  .map((product) => ({ id: product.id, label: product.name }))}
                value={selectedProducts.map(({ id, name: label }) => ({
                  id,
                  label,
                }))}
                isMulti
                isClearable
                placeholder="Products to which this discount will apply"
                onChange={(selectedIds) => {
                  setSelectedProductIds({ value: selectedIds.map(({ id }) => id) });
                }}
                isDisabled={universal}
                aria-invalid={selectedProductIds.error}
              />
              <label>
                <input
                  type="checkbox"
                  checked={universal}
                  onChange={(evt) => {
                    setUniversal(evt.target.checked);
                    setSelectedProductIds({ value: [] });
                  }}
                  aria-invalid={selectedProductIds.error}
                />
                All products
              </label>
            </fieldset>
          </section>
          <section className="paragraphs">
            <h2>Message</h2>
            <p>
              Click on the buttons below to quickly add them to your title, description, or call to action. This will
              dynamically update your widget.{" "}
              <a
                // TODO: @sargam find the correct link
                href="#"
                target="_blank"
                rel="noreferrer"
              >
                Learn more
              </a>
            </p>
            <fieldset className={cx({ danger: false })}>
              <legend>
                <label htmlFor="title">Title</label>
              </legend>
              <input
                type="text"
                id="title"
                placeholder="TODO: @sargam add placeholder"
                value={titleText}
                onChange={(evt) => setTitleText(evt.target.value)}
                aria-invalid={false}
              />
            </fieldset>
            <fieldset className={cx({ danger: false })}>
              <legend>
                <label htmlFor="description">Description</label>
              </legend>
              <textarea
                id="description"
                placeholder="TODO: @sargam add placeholder"
                value={description}
                onChange={(evt) => setDescription(evt.target.value)}
                aria-invalid={false}
              />
            </fieldset>
            <fieldset className={cx({ danger: false })}>
              <legend>
                <label htmlFor="cta">Call to action</label>
              </legend>
              <input
                type="text"
                id="cta"
                placeholder="TODO: @sargam Purchase Now"
                value={ctaText}
                onChange={(evt) => setCtaText(evt.target.value)}
                aria-invalid={false}
              />
            </fieldset>
            <fieldset className={cx({ danger: false })}>
              <legend>
                <label htmlFor="cta-type">Call to action</label>
              </legend>
              <Select
                inputId="cta-type"
                instanceId="cta-type"
                options={[
                  { id: "button", label: "Button" },
                  { id: "link", label: "Link" },
                  { id: "none", label: "None" },
                ]}
                value={{ id: "button", label: "Button" }}
              />
            </fieldset>
          </section>
          <section className="paragraphs">
            <h2>Image</h2>
            <fieldset>
              <legend>
                <label htmlFor="image">Image</label>
              </legend>
              <Select
                inputId="image"
                instanceId="image"
                isMulti={false}
                options={[
                  { id: "product", label: "Product image" },
                  { id: "custom", label: "Custom image" },
                  { id: "none", label: "None" },
                  { id: "icon", label: "Icon" },
                ]}
                value={image}
                onChange={(selected) => {
                  if (selected && typeof selected === "object" && "id" in selected) {
                    setImage({ id: selected.id, label: selected.label });
                  }
                }}
              />
              {image.id === "custom" && (
                <ThumbnailEditor
                  covers={[]}
                  thumbnail={thumbnail}
                  setThumbnail={setThumbnail}
                  permalink=""
                  nativeType="bundle"
                />
              )}
              {image.id === "icon" && (
                <div>
                  {["heart-fill"]}
                  <Button>
                    <Icon name="outline-check" />
                  </Button>
                </div>
              )}
            </fieldset>
          </section>

          <section className="paragraphs">
            <h2>Settings</h2>
            <fieldset>
              <legend>
                <label htmlFor="visibility">Widget will be visible to...</label>
              </legend>
              <Select
                inputId="visibility"
                instanceId="visibility"
                options={[
                  { id: "all", label: "All visitors" },
                  { id: "new", label: "New visitors" },
                  { id: "returning", label: "Returning visitors" },
                ]}
                value={{ id: "returning", label: "Returning visitors" }}
              />
            </fieldset>
          </section>
        </form>
      </main>
      <Preview />
    </div>
  );
};

const Preview = () => (
  <aside aria-label="Preview">
    <header>
      <h2>Preview</h2>
      <WithTooltip tip="Preview">
        <Button onClick={() => {}}>
          <Icon name="arrow-diagonal-up-right" />
        </Button>
      </WithTooltip>
    </header>
    <div className="paragraphs flex aspect-square items-center justify-center rounded border border-black">
      <SocialProofCard
        ctaType="button"
        imageType="icon"
        iconName="heart-fill"
        iconColor="#379EA3"
        title="Join 6,239 members today!"
        description="Get lifetime access to the community and start your journey now."
        buttonText="Purchase now"
        buttonUrl="#"
      />
    </div>
  </aside>
);
