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

    for _ in 1..20 do
      puts "Inside of create"
    end

    puts params[:selectedProductIds]
    puts params[:universal]
    puts params[:name]
    puts params[:titleText]
    puts params[:description]
    puts params[:ctaText]
    puts params[:ctaType][:id]
    puts params[:image][:id]
    puts params[:icon]
    puts params[:iconColor]

    social_proof = current_seller.social_proofs.build(
      name: params[:name],
      title_text: params[:titleText],
      description: params[:description],
      cta_text: params[:ctaText],
      cta_type: params[:ctaType][:id],
      image_type: params[:image][:id],
      icon: params[:icon],
      icon_color: params[:iconColor],
      product_ids: params[:selectedProductIds],
      universal: params[:universal]
    )

    if social_proof.save
      render json: { success: true, message: "Social proof created successfully" }
    else
      render json: { success: false, errors: social_proof.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
