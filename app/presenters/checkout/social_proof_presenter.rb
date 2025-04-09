# frozen_string_literal: true

class Checkout::SocialProofPresenter
  include CheckoutDashboardHelper

  attr_reader :pundit_user

  def initialize(pundit_user:)
    @pundit_user = pundit_user
  end

  def social_proof_props
    seller = pundit_user.seller
    products = pundit_user.seller.products.visible.map do |product|
      {
        id: product.external_id,
        name: product.name,
        archived: product.archived?,
        currency_type: product.price_currency_type,
        url: product.long_url,
        is_tiered_membership: product.is_tiered_membership?,
      }
    end
    {
      pages:,
      user: {
        display_offer_code_field: seller.display_offer_code_field?,
        recommendation_type: seller.recommendation_type,
        tipping_enabled: seller.tipping_enabled?,
      },
      custom_fields: seller.custom_fields.not_is_post_purchase.map(&:as_json),
      products:,
    }
  end
end
