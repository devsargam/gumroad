# frozen_string_literal: true

class SocialProofWidget < ApplicationRecord
  has_paper_trail

  # Association with links/products
  has_and_belongs_to_many :links

  validates :name, presence: true
  validates :title, presence: true
  validates :cta_type, inclusion: { in: %w[button link none],
                                    message: "%{value} is not a valid CTA type" }
  validates :image_type, inclusion: {
    in: %w[
      product_thumbnail
      custom_image
      icon
      none
    ],
    message: "%{value} is not a valid image type"
  }

  def display_template
    "#{title} - #{description} - CTA: #{cta_text}"
  end
end
