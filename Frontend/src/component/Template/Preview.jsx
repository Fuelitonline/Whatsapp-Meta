import React, { useMemo } from 'react';
import useTemplateStore from '../../app/templateStore';
import { Link, Phone } from '@mui/icons-material';

// Define supported languages directly in the component file
// const supportedLanguages = [
//   { code: 'en_US', name: 'English (US)' },
//   { code: 'en_GB', name: 'English (UK)' },
//   { code: 'es_ES', name: 'Spanish (Spain)' },
//   { code: 'es_MX', name: 'Spanish (Mexico)' },
//   { code: 'es_AR', name: 'Spanish (Argentina)' },
//   { code: 'pt_BR', name: 'Portuguese (Brazil)' },
//   { code: 'pt_PT', name: 'Portuguese (Portugal)' },
//   { code: 'fr_FR', name: 'French (France)' },
//   { code: 'de_DE', name: 'German (Germany)' },
//   { code: 'it_IT', name: 'Italian (Italy)' },
//   { code: 'hi_IN', name: 'Hindi (India)' },
//   { code: 'zh_CN', name: 'Chinese (Simplified)' },
//   { code: 'zh_TW', name: 'Chinese (Traditional)' },
//   { code: 'ja_JP', name: 'Japanese (Japan)' },
//   { code: 'ko_KR', name: 'Korean (South Korea)' },
//   { code: 'ar_AR', name: 'Arabic' },
//   { code: 'ru_RU', name: 'Russian (Russia)' },
//   { code: 'id_ID', name: 'Indonesian (Indonesia)' },
//   { code: 'ms_MY', name: 'Malay (Malaysia)' },
//   { code: 'th_TH', name: 'Thai (Thailand)' },
//   { code: 'vi_VN', name: 'Vietnamese (Vietnam)' },
//   { code: 'bn_IN', name: 'Bengali (India)' },
//   { code: 'ta_IN', name: 'Tamil (India)' },
//   { code: 'te_IN', name: 'Telugu (India)' },
//   { code: 'mr_IN', name: 'Marathi (India)' },
//   { code: 'gu_IN', name: 'Gujarati (India)' },
//   { code: 'kn_IN', name: 'Kannada (India)' },
//   { code: 'ml_IN', name: 'Malayalam (India)' },
//   { code: 'pa_IN', name: 'Punjabi (India)' },
// ];

const Preview = ({ renderFormattedText }) => {
  const {
    templateType = 'CUSTOM',
    category = '',
    headerEnabled = false,
    headerType = '',
    headerText = '',
    headerPreviewUrl = '',
    headerMediaType = '',
    headerMediaId = '',
    headerMediaLink = '',
    headerLocationName = '',
    headerLocationAddress = '',
    headerLocationLatitude = '',
    headerLocationLongitude = '',
    bodyText = '',
    bodyParameters = [],
    footerEnabled = false,
    footerText = '',
    buttonsEnabled = false,
    buttons = [],
    flowEnabled = false,
    flowButtonText = '',
    flowId = '',
    flowAction = '',
    flowToken = '',
    flowMessageVersion = '',
    otpButtonType = '',
    catalogId = '',
    couponCode = '',
    hasExpiration = false,
    limitedTimeOfferText = '',
    carouselCardCount = '2',
    mpmSections = [],
    spmProductId = '',
    sampleValues = [],
    marketingType = '',
    catalogThumbnailId = '',
    otpExpiry = '',
    touched = {},
    language,
    parameterFormat,
  } = useTemplateStore();

  // List of RTL languages
  const rtlLanguages = ['ar_AR'];

  // Determine if the selected language requires RTL
  const isRtl = rtlLanguages.includes(language);

  const localErrors = useMemo(() => ({
    bodyText: !bodyText
      ? 'Body text is required.'
      : templateType === 'AUTHENTICATION'
      ? bodyText.match(/{{[0-9]+}}/g)?.length !== 1 || bodyText.match(/{{[0-9]+}}/g)?.[0] !== '{{1}}'
        ? 'Authentication templates must contain exactly one {{1}} placeholder.'
        : ''
      : parameterFormat === 'POSITIONAL'
      ? (() => {
          const named = bodyText.match(/{{[a-z0-9_]+}}/g);
          if (named && named.length > 0) {
            return 'Positional format does not allow named placeholders like {{variable}}. Use {{1}}, {{2}}, etc.';
          }
          const positional = bodyText.match(/{{[0-9]+}}/g);
          if (positional && positional.length > 0) {
            const nums = positional.map(p => parseInt(p.replace(/{{|}}/g, '')));
            const uniqueNums = [...new Set(nums)].sort((a, b) => a - b);
            if (uniqueNums[0] !== 1 || uniqueNums.some((n, i) => n !== i + 1)) {
              return 'Positional placeholders must start from {{1}} and be sequential without gaps or duplicates.';
            }
          }
          const allPlaceholders = bodyText.match(/{{.+?}}/g) || [];
          if (allPlaceholders.some(p => !p.match(/{{[0-9]+}}/))) {
            return 'Invalid placeholder format. Use {{1}} for positional format.';
          }
          return '';
        })()
      : parameterFormat === 'NAMED'
      ? (() => {
          const positional = bodyText.match(/{{[0-9]+}}/g);
          if (positional && positional.length > 0) {
            return 'Named format does not allow positional placeholders like {{1}}. Use {{variable_name}}.';
          }
          const named = bodyText.match(/{{[a-z0-9_]+}}/g);
          if (named && named.some(p => !p.match(/{{[a-z0-9_]+}}/))) {
            return 'Named placeholders must contain only lowercase letters, numbers, and underscores (e.g., {{first_name}}).';
          }
          const allPlaceholders = bodyText.match(/{{.+?}}/g) || [];
          if (allPlaceholders.some(p => !p.match(/{{[a-z0-9_]+}}/))) {
            return 'Invalid placeholder format. Use {{variable_name}} for named format.';
          }
          return '';
        })()
      : '',
    headerText: headerEnabled && headerType === 'TEXT' && !headerText ? 'Header text is required.' : '',
    footerText: footerEnabled && !footerText ? 'Footer text is required.' : '',
    flowId: flowEnabled && !flowId ? 'Flow ID is required.' : '',
    flowButtonText: flowEnabled && !flowButtonText ? 'Flow button text is required.' : '',
    flowAction: flowEnabled && !flowAction ? 'Flow action is required.' : '',
    flowToken: flowEnabled && !flowToken ? 'Flow token is required.' : '',
    flowMessageVersion: flowEnabled && !flowMessageVersion ? 'Flow message version is required.' : '',
    couponCode: marketingType === 'COUPON' && !couponCode ? 'Coupon code is required.' : '',
    limitedTimeOfferText: marketingType === 'LIMITED_TIME_OFFER' && hasExpiration && !limitedTimeOfferText ? 'Offer text is required.' : '',
    carouselCardCount: ['MEDIA_CAROUSEL', 'PRODUCT_CAROUSEL'].includes(marketingType) &&
      (Number(carouselCardCount) < 2 || Number(carouselCardCount) > 10)
      ? 'Card count must be between 2 and 10.'
      : '',
    catalogId: ['CATALOG', 'PRODUCT_CAROUSEL', 'MPM', 'SPM'].includes(marketingType) && !catalogId
      ? 'Catalog ID is required.'
      : '',
    catalogThumbnailId: marketingType === 'CATALOG' && !catalogThumbnailId ? 'Catalog thumbnail ID is required.' : '',
    spmProductId: marketingType === 'SPM' && !spmProductId ? 'Product ID is required.' : '',
    mpmSections: marketingType === 'MPM' && Array.isArray(mpmSections)
      ? mpmSections.map((section) => ({
          title: section.title ? '' : 'Section title is required.',
          products: Array.isArray(section.productItems)
            ? section.productItems.map((product) =>
                product.product_retailer_id ? '' : 'Product ID is required.'
              )
            : [],
        }))
      : [],
    headerMediaId: headerEnabled && ['IMAGE', 'VIDEO', 'DOCUMENT'].includes(headerType) && headerMediaType === 'id' && !headerMediaId
      ? 'Media ID is required.'
      : '',
    headerMediaLink: headerEnabled && ['IMAGE', 'VIDEO', 'DOCUMENT'].includes(headerType) && headerMediaType === 'link' && !headerMediaLink
      ? 'Media link is required.'
      : '',
    headerLocationName: headerEnabled && headerType === 'LOCATION' && !headerLocationName ? 'Location name is required.' : '',
    headerLocationAddress: headerEnabled && headerType === 'LOCATION' && !headerLocationAddress ? 'Location address is required.' : '',
    headerLocationLatitude: headerEnabled && headerType === 'LOCATION' && (!headerLocationLatitude || isNaN(headerLocationLatitude) || headerLocationLatitude < -90 || headerLocationLatitude > 90)
      ? 'Valid latitude is required.'
      : '',
    headerLocationLongitude: headerEnabled && headerType === 'LOCATION' && (!headerLocationLongitude || isNaN(headerLocationLongitude) || headerLocationLongitude < -180 || headerLocationLongitude > 180)
      ? 'Valid longitude is required.'
      : '',
    otpExpiry: templateType === 'AUTHENTICATION' && (!otpExpiry || isNaN(otpExpiry) || otpExpiry <= 0 || otpExpiry > 1440)
      ? 'OTP expiry must be between 1 and 1440 minutes.'
      : '',
    buttons: buttonsEnabled && templateType !== 'AUTHENTICATION' ? buttons.map((button) => ({
      text: button.text ? '' : 'Button text is required.',
      parameter: button.parameters[0] ? '' : 'Button parameter is required.',
    })) : [],
  }), [
    templateType,
    category,
    headerEnabled,
    headerType,
    headerText,
    headerMediaType,
    headerMediaId,
    headerMediaLink,
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
    couponCode,
    hasExpiration,
    limitedTimeOfferText,
    carouselCardCount,
    catalogId,
    catalogThumbnailId,
    mpmSections,
    spmProductId,
    marketingType,
    otpExpiry,
    touched,
    parameterFormat,
  ]);

  const formattedText = useMemo(() => {
    let text = bodyText || '';

    if (touched.bodyText && localErrors.bodyText) {
      return `[Invalid: ${localErrors.bodyText}]`;
    }

    const placeholderRegex = /{{[a-z0-9_]+}}|{{[0-9]+}}/g;
    const placeholders = text.match(placeholderRegex) || [];

    placeholders.forEach((placeholder, index) => {
      const param = bodyParameters[index] || {};
      let sampleValue = '';

      if (parameterFormat === 'POSITIONAL' || templateType === 'AUTHENTICATION') {
        const sample = sampleValues[index];
        if (sample) {
          if (param.type === 'currency' && sample.value) {
            sampleValue = `${sample.value.code || 'USD'} ${sample.value.amount_1000 ? (sample.value.amount_1000 / 1000).toFixed(2) : '0.00'}`;
          } else if (param.type === 'date_time' || param.type === 'text') {
            sampleValue = sample.value || placeholder;
          }
        } else {
          sampleValue = placeholder;
        }
      } else {
        const placeholderName = placeholder.replace(/{{|}}/g, '');
        const sample = sampleValues[placeholderName];
        if (sample) {
          if (param.type === 'currency' && sample.value) {
            sampleValue = `${sample.value.code || 'USD'} ${sample.value.amount_1000 ? (sample.value.amount_1000 / 1000).toFixed(2) : '0.00'}`;
          } else if (param.type === 'date_time' || param.type === 'text') {
            sampleValue = sample.value || placeholder;
          }
        } else {
          sampleValue = placeholder;
        }
      }

      text = text.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), sampleValue);
    });

    if (templateType === 'FLOW' || marketingType === 'FLOW' || templateType === 'AUTHENTICATION') {
      return text;
    }

    return renderFormattedText(text);
  }, [bodyText, bodyParameters, sampleValues, renderFormattedText, templateType, marketingType, parameterFormat, localErrors.bodyText, touched.bodyText]);

  const mediaSource = headerMediaType === 'link' && headerMediaLink ? headerMediaLink : headerPreviewUrl;

  return (
    <div
      style={{
        maxWidth: '320px',
        margin: '0 auto',
        direction: isRtl ? 'rtl' : 'ltr',
        textAlign: isRtl ? 'right' : 'left',
      }}
      aria-live="polite"
      role="region"
      aria-label="Template preview"
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: touched.bodyText && localErrors.bodyText ? '1px solid #DC2626' : '1px solid #E5E7EB',
        }}
      >
        {headerEnabled && headerType === 'TEXT' && (
          <h4
            style={{
              fontSize: '1rem',
              fontWeight: 'bold',
              color: touched.headerText && localErrors.headerText ? '#DC2626' : '#111827',
              marginBottom: '8px',
            }}
            aria-label="Header text"
            aria-invalid={!!(touched.headerText && localErrors.headerText)}
            aria-describedby={touched.headerText && localErrors.headerText ? 'header-text-error' : undefined}
          >
            {touched.headerText && localErrors.headerText ? `[Invalid: ${localErrors.headerText}]` : headerText || 'Header Text'}
          </h4>
        )}
        {headerEnabled && ['IMAGE', 'VIDEO', 'DOCUMENT'].includes(headerType) && (
          <div
            style={{
              marginBottom: '8px',
              borderRadius: '8px',
              overflow: 'hidden',
              border:
                (touched.headerMediaId && localErrors.headerMediaId) || (touched.headerMediaLink && localErrors.headerMediaLink)
                  ? '1px solid #DC2626'
                  : 'none',
            }}
            aria-label={`${headerType.toLowerCase()} preview`}
            aria-invalid={!!((touched.headerMediaId && localErrors.headerMediaId) || (touched.headerMediaLink && localErrors.headerMediaLink))}
            aria-describedby={
              (touched.headerMediaId && localErrors.headerMediaId) || (touched.headerMediaLink && localErrors.headerMediaLink)
                ? 'media-error'
                : undefined
            }
          >
            {mediaSource ? (
              headerType === 'IMAGE' ? (
                <img src={mediaSource} alt="Header media" style={{ width: '100%', height: 'auto', display: 'block' }} />
              ) : headerType === 'VIDEO' ? (
                <video
                  src={mediaSource}
                  controls
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  aria-label="Video preview"
                />
              ) : (
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: '#F3F4F6',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ fontSize: '0.875rem', color: '#374151' }}>
                    {touched.headerMediaId && localErrors.headerMediaId
                      ? `[Invalid: ${localErrors.headerMediaId}]`
                      : touched.headerMediaLink && localErrors.headerMediaLink
                      ? `[Invalid: ${localErrors.headerMediaLink}]`
                      : `Document: ${headerMediaId || headerMediaLink || 'Not specified'}`}
                  </p>
                </div>
              )
            ) : (
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#F3F4F6',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: '0.875rem', color: '#374151' }}>
                  {touched.headerMediaId && localErrors.headerMediaId
                    ? `[Invalid: ${localErrors.headerMediaId}]`
                    : touched.headerMediaLink && localErrors.headerMediaLink
                    ? `[Invalid: ${localErrors.headerMediaLink}]`
                    : `${headerType.toLowerCase()} Preview`}
                </p>
              </div>
            )}
          </div>
        )}
        {headerEnabled && headerType === 'LOCATION' && (
          <div
            style={{
              padding: '16px',
              backgroundColor: '#F3F4F6',
              borderRadius: '8px',
              marginBottom: '8px',
              border:
                (touched.headerLocationName && localErrors.headerLocationName) ||
                (touched.headerLocationAddress && localErrors.headerLocationAddress) ||
                (touched.headerLocationLatitude && localErrors.headerLocationLatitude) ||
                (touched.headerLocationLongitude && localErrors.headerLocationLongitude)
                  ? '1px solid #DC2626'
                  : 'none',
            }}
            aria-label={`Location: ${headerLocationName || 'Location'}`}
            aria-invalid={
              !!(
                (touched.headerLocationName && localErrors.headerLocationName) ||
                (touched.headerLocationAddress && localErrors.headerLocationAddress) ||
                (touched.headerLocationLatitude && localErrors.headerLocationLatitude) ||
                (touched.headerLocationLongitude && localErrors.headerLocationLongitude)
              )
            }
            aria-describedby={
              (touched.headerLocationName && localErrors.headerLocationName) ||
              (touched.headerLocationAddress && localErrors.headerLocationAddress) ||
              (touched.headerLocationLatitude && localErrors.headerLocationLatitude) ||
              (touched.headerLocationLongitude && localErrors.headerLocationLongitude)
                ? 'location-error'
                : undefined
            }
          >
            <p style={{ fontSize: '0.875rem', color: touched.headerLocationName && localErrors.headerLocationName ? '#DC2626' : '#111827', fontWeight: 'bold' }}>
              {touched.headerLocationName && localErrors.headerLocationName ? `[Invalid: ${localErrors.headerLocationName}]` : headerLocationName || 'Location Name'}
            </p>
            <p style={{ fontSize: '0.875rem', color: touched.headerLocationAddress && localErrors.headerLocationAddress ? '#DC2626' : '#6B7280' }}>
              {touched.headerLocationAddress && localErrors.headerLocationAddress ? `[Invalid: ${localErrors.headerLocationAddress}]` : headerLocationAddress || 'Location Address'}
            </p>
            <p style={{ fontSize: '0.75rem', color: touched.headerLocationLatitude && localErrors.headerLocationLatitude ? '#DC2626' : '#6B7280' }}>
              {touched.headerLocationLatitude && localErrors.headerLocationLatitude
                ? `[Invalid: ${localErrors.headerLocationLatitude}]`
                : `Lat: ${headerLocationLatitude || 'Not specified'}`}
            </p>
            <p style={{ fontSize: '0.75rem', color: touched.headerLocationLongitude && localErrors.headerLocationLongitude ? '#DC2626' : '#6B7280' }}>
              {touched.headerLocationLongitude && localErrors.headerLocationLongitude
                ? `[Invalid: ${localErrors.headerLocationLongitude}]`
                : `Long: ${headerLocationLongitude || 'Not specified'}`}
            </p>
          </div>
        )}
        <div style={{ marginBottom: '8px' }}>
          <p
            style={{
              fontSize: '0.875rem',
              color: touched.bodyText && localErrors.bodyText ? '#DC2626' : '#111827',
              whiteSpace: 'pre-wrap',
            }}
            aria-label="Body text"
            aria-invalid={!!(touched.bodyText && localErrors.bodyText)}
            aria-describedby={touched.bodyText && localErrors.bodyText ? 'body-text-error' : undefined}
          >
            {formattedText}
          </p>
        </div>
        {marketingType === 'COUPON' && (
          <div style={{ marginBottom: '8px' }}>
            <p
              style={{
                fontSize: '0.875rem',
                color: touched.couponCode && localErrors.couponCode ? '#DC2626' : '#111827',
                fontWeight: 'bold',
              }}
              aria-label={`Coupon code: ${couponCode || 'Not specified'}`}
              aria-invalid={!!(touched.couponCode && localErrors.couponCode)}
              aria-describedby={touched.couponCode && localErrors.couponCode ? 'coupon-code-error' : undefined}
            >
              {touched.couponCode && localErrors.couponCode ? `[Invalid: ${localErrors.couponCode}]` : `Coupon: ${couponCode || 'Not specified'}`}
            </p>
          </div>
        )}
        {marketingType === 'LIMITED_TIME_OFFER' && hasExpiration && (
          <div style={{ marginBottom: '8px' }}>
            <p
              style={{
                fontSize: '0.875rem',
                color: touched.limitedTimeOfferText && localErrors.limitedTimeOfferText ? '#DC2626' : '#111827',
                fontWeight: 'bold',
              }}
              aria-label={`Limited time offer: ${limitedTimeOfferText || 'Not specified'}`}
              aria-invalid={!!(touched.limitedTimeOfferText && localErrors.limitedTimeOfferText)}
              aria-describedby={touched.limitedTimeOfferText && localErrors.limitedTimeOfferText ? 'limited-time-offer-error' : undefined}
            >
              {touched.limitedTimeOfferText && localErrors.limitedTimeOfferText
                ? `[Invalid: ${localErrors.limitedTimeOfferText}]`
                : `Offer: ${limitedTimeOfferText || 'Not specified'}`}
            </p>
          </div>
        )}
        {['MEDIA_CAROUSEL', 'PRODUCT_CAROUSEL'].includes(marketingType) && (
          <div
            style={{
              padding: '16px',
              backgroundColor: '#F3F4F6',
              borderRadius: '8px',
              marginBottom: '8px',
              border: touched.carouselCardCount && localErrors.carouselCardCount ? '1px solid #DC2626' : 'none',
            }}
            aria-label={`Carousel with ${carouselCardCount} cards`}
            aria-invalid={!!(touched.carouselCardCount && localErrors.carouselCardCount)}
            aria-describedby={touched.carouselCardCount && localErrors.carouselCardCount ? 'carousel-error' : undefined}
          >
            <p style={{ fontSize: '0.875rem', color: touched.carouselCardCount && localErrors.carouselCardCount ? '#DC2626' : '#111827', textAlign: 'center' }}>
              {touched.carouselCardCount && localErrors.carouselCardCount
                ? `[Invalid: ${localErrors.carouselCardCount}]`
                : `Carousel: ${carouselCardCount} cards`}
            </p>
          </div>
        )}
        {marketingType === 'CATALOG' && (
          <div
            style={{
              padding: '16px',
              backgroundColor: '#F3F4F6',
              borderRadius: '8px',
              marginBottom: '8px',
              border:
                (touched.catalogId && localErrors.catalogId) || (touched.catalogThumbnailId && localErrors.catalogThumbnailId)
                  ? '1px solid #DC2626'
                  : 'none',
            }}
            aria-label={`Catalog: ${catalogId || 'Not specified'}`}
            aria-invalid={!!((touched.catalogId && localErrors.catalogId) || (touched.catalogThumbnailId && localErrors.catalogThumbnailId))}
            aria-describedby={
              (touched.catalogId && localErrors.catalogId) || (touched.catalogThumbnailId && localErrors.catalogThumbnailId)
                ? 'catalog-error'
                : undefined
            }
          >
            <p style={{ fontSize: '0.875rem', color: touched.catalogId && localErrors.catalogId ? '#DC2626' : '#111827', fontWeight: 'bold' }}>
              {touched.catalogId && localErrors.catalogId ? `[Invalid: ${localErrors.catalogId}]` : `Catalog ID: ${catalogId || 'Not specified'}`}
            </p>
            <p style={{ fontSize: '0.75rem', color: touched.catalogThumbnailId && localErrors.catalogThumbnailId ? '#DC2626' : '#6B7280' }}>
              {touched.catalogThumbnailId && localErrors.catalogThumbnailId
                ? `[Invalid: ${localErrors.catalogThumbnailId}]`
                : `Thumbnail ID: ${catalogThumbnailId || 'Not specified'}`}
            </p>
          </div>
        )}
        {marketingType === 'SPM' && (
          <div
            style={{
              padding: '16px',
              backgroundColor: '#F3F4F6',
              borderRadius: '8px',
              marginBottom: '8px',
              border: (touched.catalogId && localErrors.catalogId) || (touched.spmProductId && localErrors.spmProductId) ? '1px solid #DC2626' : 'none',
            }}
            aria-label={`Single Product: ${spmProductId || 'Not specified'}`}
            aria-invalid={!!((touched.catalogId && localErrors.catalogId) || (touched.spmProductId && localErrors.spmProductId))}
            aria-describedby={
              (touched.catalogId && localErrors.catalogId) || (touched.spmProductId && localErrors.spmProductId) ? 'spm-error' : undefined
            }
          >
            <p style={{ fontSize: '0.875rem', color: (touched.catalogId && localErrors.catalogId) || (touched.spmProductId && localErrors.spmProductId) ? '#DC2626' : '#111827', fontWeight: 'bold' }}>
              {touched.catalogId && localErrors.catalogId
                ? `[Invalid: ${localErrors.catalogId}]`
                : touched.spmProductId && localErrors.spmProductId
                ? `[Invalid: ${localErrors.spmProductId}]`
                : `Product ID: ${spmProductId || 'Not specified'}`}
            </p>
          </div>
        )}
        {marketingType === 'MPM' && (
          <div
            style={{
              padding: '16px',
              backgroundColor: '#F3F4F6',
              borderRadius: '8px',
              marginBottom: '8px',
              border: touched.mpmSections && localErrors.mpmSections.some((section) => section.title || section.products.some((p) => p)) ? '1px solid #DC2626' : 'none',
            }}
            aria-label="Multi-product sections"
            aria-invalid={!!(touched.mpmSections && localErrors.mpmSections.some((section) => section.title || section.products.some((p) => p)))}
            aria-describedby={touched.mpmSections && localErrors.mpmSections.some((section) => section.title || section.products.some((p) => p)) ? 'mpm-error' : undefined}
          >
            {mpmSections.map((section, index) => (
              <div key={index} style={{ marginBottom: '8px' }}>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: touched.mpmSections && localErrors.mpmSections[index]?.title ? '#DC2626' : '#111827',
                    fontWeight: 'bold',
                  }}
                  aria-label={`Section ${index + 1}: ${section.title || 'Not specified'}`}
                >
                  {touched.mpmSections && localErrors.mpmSections[index]?.title
                    ? `[Invalid: ${localErrors.mpmSections[index].title}]`
                    : section.title || `Section ${index + 1}`}
                </p>
                {section.productItems.map((product, pIndex) => (
                  <p
                    key={pIndex}
                    style={{
                      fontSize: '0.75rem',
                      color: touched.mpmSections && localErrors.mpmSections[index]?.products[pIndex] ? '#DC2626' : '#6B7280',
                      marginLeft: '8px',
                    }}
                    aria-label={`Product ${pIndex + 1}: ${product.product_retailer_id || 'Not specified'}`}
                  >
                    {touched.mpmSections && localErrors.mpmSections[index]?.products[pIndex]
                      ? `[Invalid: ${localErrors.mpmSections[index].products[pIndex]}]`
                      : product.product_retailer_id || 'Product ID not specified'}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}
        {footerEnabled && (
          <p
            style={{
              fontSize: '0.75rem',
              color: touched.footerText && localErrors.footerText ? '#DC2626' : '#6B7280',
              marginTop: '8px',
            }}
            aria-label={`Footer: ${footerText || 'Not specified'}`}
            aria-invalid={!!(touched.footerText && localErrors.footerText)}
            aria-describedby={touched.footerText && localErrors.footerText ? 'footer-text-error' : undefined}
          >
            {touched.footerText && localErrors.footerText ? `[Invalid: ${localErrors.footerText}]` : footerText || 'Footer Text'}
          </p>
        )}
        {(flowEnabled || templateType === 'AUTHENTICATION') && (
          <div style={{ borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column', padding: '8px' }}>
            {templateType === 'AUTHENTICATION' ? (
              <button
                style={{
                  padding: '8px',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  color: touched.otpExpiry && localErrors.otpExpiry ? '#DC2626' : '#00A884',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                aria-label={otpButtonType === 'COPY_CODE' ? 'Copy Code' : 'Autofill'}
                aria-invalid={!!(touched.otpExpiry && localErrors.otpExpiry)}
                aria-describedby={touched.otpExpiry && localErrors.otpExpiry ? 'otp-button-error' : undefined}
              >
                {otpButtonType === 'COPY_CODE' ? 'Copy Code' : 'Autofill'}
              </button>
            ) : (
              <button
                style={{
                  padding: '8px',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  color:
                    (touched.flowButtonText && localErrors.flowButtonText) ||
                    (touched.flowId && localErrors.flowId) ||
                    (touched.flowAction && localErrors.flowAction) ||
                    (touched.flowToken && localErrors.flowToken) ||
                    (touched.flowMessageVersion && localErrors.flowMessageVersion)
                      ? '#DC2626'
                      : '#00A884',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                aria-label={`Start flow: ${flowButtonText || 'Start Flow'}`}
                aria-invalid={
                  !!(
                    (touched.flowButtonText && localErrors.flowButtonText) ||
                    (touched.flowId && localErrors.flowId) ||
                    (touched.flowAction && localErrors.flowAction) ||
                    (touched.flowToken && localErrors.flowToken) ||
                    (touched.flowMessageVersion && localErrors.flowMessageVersion)
                  )
                }
                aria-describedby={
                  (touched.flowButtonText && localErrors.flowButtonText) ||
                  (touched.flowId && localErrors.flowId) ||
                  (touched.flowAction && localErrors.flowAction) ||
                  (touched.flowToken && localErrors.flowToken) ||
                  (touched.flowMessageVersion && localErrors.flowMessageVersion)
                    ? 'flow-button-error'
                    : undefined
                }
              >
                {touched.flowButtonText && localErrors.flowButtonText
                  ? `[Invalid: ${localErrors.flowButtonText}]`
                  : touched.flowId && localErrors.flowId
                  ? `[Invalid: ${localErrors.flowId}]`
                  : flowButtonText || 'Start Flow'}
              </button>
            )}
          </div>
        )}
        {buttonsEnabled && templateType !== 'AUTHENTICATION' && marketingType !== 'COUPON' && (
          <div style={{ borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column', padding: '8px' }}>
            {buttons.map((button, index) => (
              <button
                key={index}
                style={{
                  padding: '8px',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  color: touched.buttons && (localErrors.buttons[index]?.text || localErrors.buttons[index]?.parameter) ? '#DC2626' : '#00A884',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                aria-label={
                  button.text ||
                  (button.sub_type === 'url' || button.type === 'URL'
                    ? 'Visit URL'
                    : button.sub_type === 'phone_number' || button.type === 'CALL'
                    ? 'Call phone number'
                    : button.sub_type === 'copy_code'
                    ? 'Copy code'
                    : button.sub_type === 'catalog'
                    ? 'View catalog'
                    : `Quick reply: ${button.parameters[0]?.payload || `Button ${index + 1}`}`)
                }
                aria-invalid={!!(touched.buttons && (localErrors.buttons[index]?.text || localErrors.buttons[index]?.parameter))}
                aria-describedby={
                  touched.buttons && (localErrors.buttons[index]?.text || localErrors.buttons[index]?.parameter) ? `button-${index}-error` : undefined
                }
              >
                {(button.sub_type === 'url' || button.type === 'URL') && <Link style={{ fontSize: '16px', color: '#00A884' }} />}
                {(button.sub_type === 'phone_number' || button.type === 'CALL') && <Phone style={{ fontSize: '16px', color: '#00A884' }} />}
                {touched.buttons && localErrors.buttons[index]?.text
                  ? `[Invalid: ${localErrors.buttons[index].text}]`
                  : touched.buttons && localErrors.buttons[index]?.parameter
                  ? `[Invalid: ${localErrors.buttons[index].parameter}]`
                  : button.text ||
                    (button.sub_type === 'url' || button.type === 'URL'
                      ? 'Visit URL'
                      : button.sub_type === 'phone_number' || button.type === 'CALL'
                      ? 'Call Number'
                      : button.sub_type === 'copy_code'
                      ? 'Copy Code'
                      : button.sub_type === 'catalog'
                      ? 'View Catalog'
                      : button.parameters[0]?.payload || `Button ${index + 1}`)}
              </button>
            ))}
          </div>
        )}
        {(touched.bodyText && localErrors.bodyText ||
          touched.headerText && localErrors.headerText ||
          touched.footerText && localErrors.footerText ||
          touched.headerMediaId && localErrors.headerMediaId ||
          touched.headerMediaLink && localErrors.headerMediaLink ||
          touched.headerLocationName && localErrors.headerLocationName ||
          touched.headerLocationAddress && localErrors.headerLocationAddress ||
          touched.headerLocationLatitude && localErrors.headerLocationLatitude ||
          touched.headerLocationLongitude && localErrors.headerLocationLongitude ||
          touched.couponCode && localErrors.couponCode ||
          touched.limitedTimeOfferText && localErrors.limitedTimeOfferText ||
          touched.carouselCardCount && localErrors.carouselCardCount ||
          touched.catalogId && localErrors.catalogId ||
          touched.catalogThumbnailId && localErrors.catalogThumbnailId ||
          touched.spmProductId && localErrors.spmProductId ||
          touched.mpmSections && localErrors.mpmSections.some((section) => section.title || section.products.some((p) => p)) ||
          touched.otpExpiry && localErrors.otpExpiry ||
          touched.flowButtonText && localErrors.flowButtonText ||
          touched.flowId && localErrors.flowId ||
          touched.flowAction && localErrors.flowAction ||
          touched.flowToken && localErrors.flowToken ||
          touched.flowMessageVersion && localErrors.flowMessageVersion ||
          touched.buttons && localErrors.buttons.some((b) => b.text || b.parameter)) && (
          <div style={{ marginTop: '8px' }}>
            {touched.bodyText && localErrors.bodyText && (
              <p id="body-text-error" style={{ fontSize: '0.75rem', color: '#DC2626' }}>
                {localErrors.bodyText}
              </p>
            )}
            {touched.headerText && localErrors.headerText && (
              <p id="header-text-error" style={{ fontSize: '0.75rem', color: '#DC2626' }}>
                {localErrors.headerText}
              </p>
            )}
            {touched.footerText && localErrors.footerText && (
              <p id="footer-text-error" style={{ fontSize: '0.75rem', color: '#DC2626' }}>
                {localErrors.footerText}
              </p>
            )}
            {(touched.headerMediaId && localErrors.headerMediaId || touched.headerMediaLink && localErrors.headerMediaLink) && (
              <p id="media-error" style={{ fontSize: '0.75rem', color: '#DC2626' }}>
                {localErrors.headerMediaId || localErrors.headerMediaLink}
              </p>
            )}
            {(touched.headerLocationName && localErrors.headerLocationName ||
              touched.headerLocationAddress && localErrors.headerLocationAddress ||
              touched.headerLocationLatitude && localErrors.headerLocationLatitude ||
              touched.headerLocationLongitude && localErrors.headerLocationLongitude) && (
              <p id="location-error" style={{ fontSize: '0.75rem', color: '#DC2626' }}>
                {localErrors.headerLocationName ||
                  localErrors.headerLocationAddress ||
                  localErrors.headerLocationLatitude ||
                  localErrors.headerLocationLongitude}
              </p>
            )}
            {touched.couponCode && localErrors.couponCode && (
              <p id="coupon-code-error" style={{ fontSize: '0.75rem', color: '#DC2626' }}>
                {localErrors.couponCode}
              </p>
            )}
            {touched.limitedTimeOfferText && localErrors.limitedTimeOfferText && (
              <p id="limited-time-offer-error" style={{ fontSize: '0.75rem', color: '#DC2626' }}>
                {localErrors.limitedTimeOfferText}
              </p>
            )}
            {touched.carouselCardCount && localErrors.carouselCardCount && (
              <p id="carousel-error" style={{ fontSize: '0.75rem', color: '#DC2626' }}>
                {localErrors.carouselCardCount}
              </p>
            )}
            {(touched.catalogId && localErrors.catalogId) || (touched.catalogThumbnailId && localErrors.catalogThumbnailId) && (
              <p id="catalog-error" style={{ fontSize: '0.75rem', color: '#DC2626' }}>
                {localErrors.catalogId || localErrors.catalogThumbnailId}
              </p>
            )}
            {(touched.catalogId && localErrors.catalogId) || (touched.spmProductId && localErrors.spmProductId) && (
              <p id="spm-error" style={{ fontSize: '0.75rem', color: '#DC2626' }}>
                {localErrors.catalogId || localErrors.spmProductId}
              </p>
            )}
            {touched.mpmSections &&
              localErrors.mpmSections.map(
                (section, index) =>
                  (section.title || section.products.some((p) => p)) && (
                    <div key={index} id={`mpm-error-${index}`} style={{ fontSize: '0.75rem', color: '#DC2626' }}>
                      {section.title && <p>{`Section ${index + 1}: ${section.title}`}</p>}
                      {section.products.map(
                        (p, pIndex) =>
                          p && <p key={pIndex}>{`Product ${pIndex + 1} in Section ${index + 1}: ${p}`}</p>
                      )}
                    </div>
                  )
              )}
            {touched.otpExpiry && localErrors.otpExpiry && (
              <p id="otp-button-error" style={{ fontSize: '0.75rem', color: '#DC2626' }}>
                {localErrors.otpExpiry}
              </p>
            )}
            {(touched.flowButtonText && localErrors.flowButtonText ||
              touched.flowId && localErrors.flowId ||
              touched.flowAction && localErrors.flowAction ||
              touched.flowToken && localErrors.flowToken ||
              touched.flowMessageVersion && localErrors.flowMessageVersion) && (
              <p id="flow-button-error" style={{ fontSize: '0.75rem', color: '#DC2626' }}>
                {localErrors.flowButtonText ||
                  localErrors.flowId ||
                  localErrors.flowAction ||
                  localErrors.flowToken ||
                  localErrors.flowMessageVersion}
              </p>
            )}
            {touched.buttons &&
              localErrors.buttons.map(
                (button, index) =>
                  (button.text || button.parameter) && (
                    <p key={index} id={`button-${index}-error`} style={{ fontSize: '0.75rem', color: '#DC2626' }}>
                      {`Button ${index + 1}: ${button.text || button.parameter}`}
                    </p>
                  )
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;