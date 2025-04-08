class SocialProofWidget < ApplicationRecord
  validates :name, presence: true
  validates :title, presence: true
  validates :cta_type, inclusion: { in: %w[button link none],
                                    message: "%{value} is not a valid CTA type" }
  validates :image_type, inclusion: {
    in: %w[
      product_thumbnail
      custom_image
      icon_*
      solid_fire
      solid_heart
      patch_check_fill
      cart3-fill
      solid-users
      star-fill
      solid-sparkles
      clock_fill
      solid_gift
      solid_lightning_bolt
    ],
    message: "%{value} is not a valid image type"
  }

  def display_template
    "#{title} - #{description} - CTA: #{cta_text}"
  end
end
