import * as React from "react";

import { NavigationButton } from "$app/components/Button";
import { Icon } from "$app/components/Icons";

interface BaseSocialProofCardProps {
  title: string;
  description: string;
}

interface ProductImageProps extends BaseSocialProofCardProps {
  imageType: "product";
  imageUrl: string;
}

interface CustomImageProps extends BaseSocialProofCardProps {
  imageType: "custom";
  imageUrl: string;
}

interface IconImageProps extends BaseSocialProofCardProps {
  imageType: "icon";
  iconName: IconName;
  iconColor: string;
}

interface NoImageProps extends BaseSocialProofCardProps {
  imageType: "none";
}

interface ButtonCTAProps {
  ctaType: "button";
  buttonText: string;
  buttonUrl: string;
}

interface LinkCTAProps {
  ctaType: "link";
  linkText: string;
  linkUrl: string;
}

interface NoCTAProps {
  ctaType: "none";
}

type CTATypeProps = ButtonCTAProps | LinkCTAProps | NoCTAProps;

type SocialProofCardProps = (ProductImageProps | CustomImageProps | IconImageProps | NoImageProps) & CTATypeProps;

export const SocialProofCard = (props: SocialProofCardProps) => {
  const { title, description } = props;

  const renderImage = () => {
    switch (props.imageType) {
      case "product":
      case "custom":
        return <img src={props.imageUrl} alt={title} />;
      case "icon":
        return (
          <div
            className="grid h-[72px] w-[72px] place-items-center rounded border border-black"
            style={{ backgroundColor: `${props.iconColor}4D` }}
          >
            <Icon name={props.iconName} style={{ color: props.iconColor }} />
          </div>
        );
      case "none":
        return null;
    }
  };

  const renderCTA = () => {
    switch (props.ctaType) {
      case "button":
        return (
          <NavigationButton href={props.buttonUrl} color="accent" className="w-full">
            {props.buttonText}
          </NavigationButton>
        );
      case "link":
        return (
          <a href={props.linkUrl} className="text-sm font-bold text-teal-400 no-underline">
            {props.linkText}
          </a>
        );
      case "none":
        return null;
    }
  };

  return (
    <div
      className="relative flex w-full max-w-sm flex-col gap-4 rounded-lg border border-[#1D1E17] p-4"
      style={{ boxShadow: "4px 4px 16px 0px #00000029" }}
    >
      <div className="">
        <div className="flex gap-3">
          {renderImage()}
          <div className="flex-1">
            <div className="text-sm font-bold">{title}</div>
            <p className="text-sm">{description}</p>
            {props.ctaType === "link" && renderCTA()}
          </div>
        </div>
        <Icon name="x" className="absolute right-2 top-1 text-black" />
      </div>
      {props.ctaType === "button" && renderCTA()}
    </div>
  );
};
