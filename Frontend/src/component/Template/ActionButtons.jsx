import React, { useMemo } from 'react';
import useTemplateStore from '../../app/templateStore';

const ActionButtons = ({ template, handleClear, handleSubmit }) => {
  const {
    templateType,
    category,
    templateName,
    language,
    headerEnabled,
    headerType,
    headerText,
    headerMediaId,
    headerMediaLink,
    headerMediaType,
    headerLocationName,
    headerLocationAddress,
    headerLocationLatitude,
    headerLocationLongitude,
    bodyText,
    footerEnabled,
    footerText,
    buttonsEnabled,
    buttons,
    flowEnabled,
    flowId,
    flowButtonText,
    flowAction,
    flowToken,
    flowMessageVersion,
    otpButtonType,
    otpExpiry,
    couponCode,
    hasExpiration,
    limitedTimeOfferText,
    carouselCardCount,
    catalogId,
    catalogThumbnailId,
    mpmSections,
    spmProductId,
    marketingType,
    getSupportedLanguages,
    parameterFormat,
  } = useTemplateStore();

  const supportedLanguages = getSupportedLanguages();

  const isSubmitDisabled = useMemo(() => {
    // Validate language
    if (!templateName || !language || !supportedLanguages.find((lang) => lang.code === language)) return true;

    // Body text validation
    if (['CUSTOM', 'COUPON', 'LIMITED_TIME_OFFER', 'FLOW', 'AUTHENTICATION'].includes(templateType) && !bodyText) return true;
    if (templateType === 'AUTHENTICATION' && bodyText) {
      const placeholders = bodyText.match(/{{[0-9]+}}/g) || [];
      if (placeholders.length !== 1 || placeholders[0] !== '{{1}}') return true;
    }
    if (bodyText && templateType !== 'AUTHENTICATION') {
      if (parameterFormat === 'POSITIONAL') {
        const named = bodyText.match(/{{[a-z0-9_]+}}/g);
        if (named && named.length > 0) {
          return true; // Named placeholders not allowed in positional format
        }
        const positional = bodyText.match(/{{[0-9]+}}/g);
        if (positional && positional.length > 0) {
          const nums = positional.map(p => parseInt(p.replace(/{{|}}/g, '')));
          const uniqueNums = [...new Set(nums)].sort((a, b) => a - b);
          if (uniqueNums[0] !== 1 || uniqueNums.some((n, i) => n !== i + 1)) {
            return true; // Positional placeholders must start from {{1}} and be sequential without gaps or duplicates
          }
        }
        const allPlaceholders = bodyText.match(/{{.+?}}/g) || [];
        if (allPlaceholders.some(p => !p.match(/{{[0-9]+}}/))) {
          return true; // Invalid placeholder format for positional
        }
      } else if (parameterFormat === 'NAMED') {
        const positional = bodyText.match(/{{[0-9]+}}/g);
        if (positional && positional.length > 0) {
          return true; // Positional placeholders not allowed in named format
        }
        const named = bodyText.match(/{{[a-z0-9_]+}}/g);
        if (named && named.some(p => !p.match(/{{[a-z0-9_]+}}/))) {
          return true; // Named placeholders must contain only lowercase letters, numbers, and underscores
        }
        const allPlaceholders = bodyText.match(/{{.+?}}/g) || [];
        if (allPlaceholders.some(p => !p.match(/{{[a-z0-9_]+}}/))) {
          return true; // Invalid placeholder format for named
        }
      }
    }

    // Header validation
    if (['CUSTOM', 'COUPON', 'LIMITED_TIME_OFFER', 'FLOW', 'SPM', 'PRODUCT_CAROUSEL', 'CATALOG'].includes(templateType) && headerEnabled) {
      if (headerType === 'TEXT' && !headerText) return true;
      if (['IMAGE', 'VIDEO', 'DOCUMENT'].includes(headerType)) {
        if (headerMediaType === 'id' && !headerMediaId) return true;
        if (headerMediaType === 'link' && !headerMediaLink) return true;
      }
      if (headerType === 'LOCATION') {
        if (!headerLocationName || !headerLocationAddress) return true;
        if (!headerLocationLatitude || isNaN(headerLocationLatitude) || headerLocationLatitude < -90 || headerLocationLatitude > 90) return true;
        if (!headerLocationLongitude || isNaN(headerLocationLongitude) || headerLocationLongitude < -180 || headerLocationLongitude > 180) return true;
      }
      if (headerType === 'PRODUCT' && !catalogId) return true;
    }

    // Footer validation
    if (footerEnabled && (!footerText || footerText.length > 60)) return true;

    // Button validation
    if (buttonsEnabled && templateType !== 'AUTHENTICATION') {
      if (buttons.length > 10 || buttons.length === 0) return true;
      const validSubTypes = category === 'UTILITY'
        ? ['quick_reply', 'url', 'phone_number', 'copy_code']
        : ['quick_reply', 'url', 'phone_number', 'copy_code', 'catalog'];
      for (const button of buttons) {
        if (!button.text || button.text.length > 25) return true;
        if (!validSubTypes.includes(button.sub_type)) return true;
        if (button.sub_type === 'phone_number' && (!button.parameters[0]?.phone_number || !/^\+?\d{1,20}$/.test(button.parameters[0].phone_number))) return true;
        if (button.sub_type === 'url' && (!button.parameters[0]?.text || !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(button.parameters[0].text))) return true;
        if (button.sub_type === 'catalog' && (!button.parameters[0]?.catalog_id || button.parameters[0].catalog_id !== catalogId)) return true;
        if (button.sub_type === 'quick_reply' && (!button.parameters[0]?.payload || button.parameters[0].payload.length > 100)) return true;
        if (button.sub_type === 'copy_code' && (!button.parameters[0]?.payload || button.parameters[0].payload.length > 15 || marketingType !== 'COUPON')) return true;
      }
    }

    // Flow validation
    if ((templateType === 'FLOW' || marketingType === 'FLOW') && flowEnabled) {
      if (!flowId || !flowButtonText || flowButtonText.length > 25 || !flowAction || !flowToken || !flowMessageVersion) return true;
      if (!/^\d+\.\d+(\.\d+)?$/.test(flowMessageVersion)) return true;
    }

    // Authentication validation
    if (templateType === 'AUTHENTICATION') {
      if (!otpButtonType || !otpExpiry || isNaN(otpExpiry) || Number(otpExpiry) <= 0 || Number(otpExpiry) > 1440) return true;
    }

    // Coupon validation
    if (marketingType === 'COUPON' && (!couponCode || couponCode.length > 15)) return true;

    // Limited-time offer validation
    if (marketingType === 'LIMITED_TIME_OFFER' && hasExpiration && (!limitedTimeOfferText || limitedTimeOfferText.length > 72)) return true;

    // Carousel validation
    if (['MEDIA_CAROUSEL', 'PRODUCT_CAROUSEL'].includes(marketingType)) {
      if (!carouselCardCount || isNaN(carouselCardCount) || Number(carouselCardCount) < 2 || Number(carouselCardCount) > 10) return true;
    }

    // Catalog validation
    if (['PRODUCT_CAROUSEL', 'CATALOG', 'MPM', 'SPM'].includes(marketingType) && !catalogId) return true;
    if (marketingType === 'CATALOG' && !catalogThumbnailId) return true;

    // MPM validation
    if (marketingType === 'MPM') {
      if (!catalogId || !mpmSections.length || mpmSections.length > 10) return true;
      for (const section of mpmSections) {
        if (!section.title || section.title.length > 24) return true;
        if (!section.productItems.length) return true;
        for (const product of section.productItems) {
          if (!product.product_retailer_id) return true;
        }
      }
    }

    // SPM validation
    if (marketingType === 'SPM' && (!catalogId || !spmProductId)) return true;

    return false;
  }, [
    templateName,
    language,
    templateType,
    category,
    marketingType,
    bodyText,
    headerEnabled,
    headerType,
    headerText,
    headerMediaId,
    headerMediaLink,
    headerMediaType,
    headerLocationName,
    headerLocationAddress,
    headerLocationLatitude,
    headerLocationLongitude,
    catalogId,
    catalogThumbnailId,
    footerEnabled,
    footerText,
    buttonsEnabled,
    buttons,
    flowEnabled,
    flowId,
    flowButtonText,
    flowAction,
    flowToken,
    flowMessageVersion,
    otpButtonType,
    otpExpiry,
    couponCode,
    hasExpiration,
    limitedTimeOfferText,
    carouselCardCount,
    mpmSections,
    spmProductId,
    parameterFormat,
  ]);

  const submitButtonText = template
    ? `Update ${
        category === 'UTILITY'
          ? templateType === 'FLOW'
            ? 'Flow'
            : 'Utility'
          : category === 'MARKETING'
          ? marketingType === 'COUPON'
            ? 'Coupon'
            : marketingType === 'LIMITED_TIME_OFFER'
            ? 'Limited-Time Offer'
            : marketingType === 'MEDIA_CAROUSEL'
            ? 'Media Carousel'
            : marketingType === 'PRODUCT_CAROUSEL'
            ? 'Product Carousel'
            : marketingType === 'MPM'
            ? 'Multi-Product Message'
            : marketingType === 'SPM'
            ? 'Single-Product Message'
            : marketingType === 'CATALOG'
            ? 'Catalog'
            : marketingType === 'FLOW'
            ? 'Flow'
            : 'Marketing'
          : 'Authentication'
      } Template (${supportedLanguages.find((lang) => lang.code === language)?.name || language})`
    : `Create ${
        category === 'UTILITY'
          ? templateType === 'FLOW'
            ? 'Flow'
            : 'Utility'
          : category === 'MARKETING'
          ? marketingType === 'COUPON'
            ? 'Coupon'
            : marketingType === 'LIMITED_TIME_OFFER'
            ? 'Limited-Time Offer'
            : marketingType === 'MEDIA_CAROUSEL'
            ? 'Media Carousel'
            : marketingType === 'PRODUCT_CAROUSEL'
            ? 'Product Carousel'
            : marketingType === 'MPM'
            ? 'Multi-Product Message'
            : marketingType === 'SPM'
            ? 'Single-Product Message'
            : marketingType === 'CATALOG'
            ? 'Catalog'
            : marketingType === 'FLOW'
            ? 'Flow'
            : 'Marketing'
          : 'Authentication'
      } Template (${supportedLanguages.find((lang) => lang.code === language)?.name || language})`;

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        justifyContent: 'flex-end',
        marginTop: '32px',
      }}
    >
      <button
        onClick={handleClear}
        style={{
          padding: '12px 24px',
          border: '1px solid #D1D5DB',
          borderRadius: '8px',
          backgroundColor: '#FFFFFF',
          color: '#374151',
          fontSize: '0.875rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        aria-label="Clear template form"
      >
        Clear
      </button>
      <button
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
        style={{
          padding: '12px 24px',
          border: '1px solid #2563EB',
          borderRadius: '8px',
          backgroundColor: isSubmitDisabled ? '#E5E7EB' : '#2563EB',
          color: isSubmitDisabled ? '#6B7280' : '#FFFFFF',
          fontSize: '0.875rem',
          fontWeight: '500',
          cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
        }}
        aria-label={submitButtonText}
        aria-disabled={isSubmitDisabled}
      >
        {submitButtonText}
      </button>
    </div>
  );
};

export default ActionButtons;