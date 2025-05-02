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

    social_proof_widget_params
    puts "social_proof_widget_params"
    puts social_proof_widget_params
    puts "-----------------------------------"
    puts social_proof_widget_params[:cta_type]
    puts social_proof_widget_params[:image_type]

    social_proof_widget = SocialProofWidget.new({
                                                  name: social_proof_widget_params[:name],
                                                  title: social_proof_widget_params[:title],
                                                  description: social_proof_widget_params[:description],
                                                  cta_text: social_proof_widget_params[:cta_text],
                                                  cta_type: social_proof_widget_params[:cta_type],
                                                  image_type: social_proof_widget_params[:image_type],
                                                  icon_name: social_proof_widget_params[:icon],
                                                  universal: social_proof_widget_params[:universal]
                                                })
    social_proof_widget.links = current_seller.links.alive

    if social_proof_widget.save
      puts "social_proof_widget.save"
      render json: {
        success: true,
        social_proof_widgets: [social_proof_widget].map { |widget| presenter.social_proof_widget_props(widget) }
      }
    else
      puts "social_proof_widget.errors"
      puts social_proof_widget.errors.full_messages
      render json: {
        success: false,
        error_message: social_proof_widget.errors.full_messages.first
      }
    end
  end

  private
    def parse_date_times
      # social_proof_widget_params[:valid_at] = Date.parse(social_proof_widget_params[:valid_at]) if social_proof_widget_params[:valid_at].present?
      # social_proof_widget_params[:expires_at] = Date.parse(social_proof_widget_params[:expires_at]) if social_proof_widget_params[:expires_at].present?
    end

    def social_proof_widget_params
      params.permit(
        :name,
        :title,
        :description,
        :cta_text,
        :cta_type,
        :image_type,
        :icon,
        :icon_color,
        :selected_product_ids,
        :universal
      )
    end
end
