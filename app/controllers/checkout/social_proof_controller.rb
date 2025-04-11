# frozen_string_literal: true

class Checkout::SocialProofController < Sellers::BaseController
  def show
    authorize [:checkout, :social_proof]

    @title = "Social proof"
    @social_proof_props = Checkout::SocialProofPresenter.new(pundit_user:).social_proof_props
    @body_class = "fixed-aside"
    @products = current_seller.products.order(:name)

    render :index
  end

  def create
    authorize [:checkout, :social_proof]

    render json: { message: "Social proof created" }
  end
end
