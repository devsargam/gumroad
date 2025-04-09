# frozen_string_literal: true

class Checkout::SocialProofController < Sellers::BaseController
  def show
    authorize [:checkout, :social_proof]

    @title = "Social proof"
    @social_proof_props = Checkout::SocialProofPresenter.new(pundit_user:).social_proof_props
    @body_class = "fixed-aside"
    render :index
  end

  def index
    authorize [:checkout, :social_proof]
    @title = "Social Proof"
    pagination, offer_codes = fetch_offer_codes
    @presenter = Checkout::SocialProofPresenter.new(pundit_user:, offer_codes:, pagination:)
    render :index
  end

  def update
    authorize [:checkout, :social_proof]
    begin
      ActiveRecord::Base.transaction do
        current_seller.update!(permitted_params[:user]) if permitted_params[:user]
        if permitted_params[:custom_fields]
          all_fields = current_seller.custom_fields.to_a
          permitted_params[:custom_fields].each do |field|
            existing = all_fields.extract! { _1.external_id == field[:id] }[0] || current_seller.custom_fields.build
            existing.update!(field.except(:id, :products))
            existing.products = field[:global] ? [] : current_seller.products.by_external_ids(field[:products])
          end
          all_fields.each(&:destroy)
          current_seller.custom_fields.reload
        end
      end
      render json: Checkout::FormPresenter.new(pundit_user:).form_props
    rescue ActiveRecord::RecordInvalid => e
      render json: { error_message: e.record.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  private
    def permitted_params
      params.permit(policy([:checkout, :form]).permitted_attributes)
    end

    def fetch_offer_codes
      page = (params[:page] || 1).to_i
      per_page = 20

      offer_codes = current_seller.offer_codes.order(created_at: :desc).page_with_kaminari(page).per(per_page)
      pagination = {
        current_page: offer_codes.current_page,
        total_pages: offer_codes.total_pages,
        total_count: offer_codes.total_count
      }

      [pagination, offer_codes]
    end
end
