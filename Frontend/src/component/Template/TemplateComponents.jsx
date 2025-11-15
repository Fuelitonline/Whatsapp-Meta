import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined, Delete } from '@mui/icons-material';
import useTemplateStore from '../../app/templateStore';

const TemplateComponents = ({
  textareaRef,
  applyFormatting,
  handleFileChange,
  handleAddButton,
  handleButtonChange,
  handleSampleChange,
  headerMediaType,
  otpExpiry,
}) => {
  const {
    templateType,
    category,
    headerEnabled,
    setHeaderEnabled,
    headerType,
    setHeaderType,
    headerText,
    setHeaderText,
    setHeaderMediaType,
    headerMediaId,
    setHeaderMediaId,
    headerMediaLink,
    setHeaderMediaLink,
    headerLocationLatitude,
    setHeaderLocationLatitude,
    headerLocationLongitude,
    setHeaderLocationLongitude,
    headerLocationName,
    setHeaderLocationName,
    headerLocationAddress,
    setHeaderLocationAddress,
    bodyText,
    setBodyText,
    bodyParameters,
    setBodyParameters,
    footerEnabled,
    setFooterEnabled,
    footerText,
    setFooterText,
    buttonsEnabled,
    setButtonsEnabled,
    buttons,
    setButtons,
    flowEnabled,
    setFlowEnabled,
    flowId,
    setFlowId,
    flowButtonText,
    setFlowButtonText,
    flowAction,
    setFlowAction,
    flowToken,
    setFlowToken,
    flowMessageVersion,
    setFlowMessageVersion,
    otpButtonType,
    setOtpButtonType,
    setOtpExpiry,
    catalogId,
    setCatalogId,
    sampleValues,
    marketingType,
    couponCode,
    setCouponCode,
    limitedTimeOfferText,
    setLimitedTimeOfferText,
    hasExpiration,
    setHasExpiration,
    carouselCardCount,
    setCarouselCardCount,
    mpmSections,
    setMpmSections,
    spmProductId,
    setSpmProductId,
    catalogThumbnailId,
    setCatalogThumbnailId,
    touched,
    setTouched,
    parameterFormat,
  } = useTemplateStore();

  const [localErrors, setLocalErrors] = useState({
    bodyText: '',
    headerText: '',
    footerText: '',
    flowId: '',
    flowButtonText: '',
    couponCode: '',
    limitedTimeOfferText: '',
    carouselCardCount: '',
    catalogId: '',
    catalogThumbnailId: '',
    spmProductId: '',
    mpmSections: [],
    headerMediaId: '',
    headerMediaLink: '',
    headerLocationName: '',
    headerLocationAddress: '',
    headerLocationLatitude: '',
    headerLocationLongitude: '',
    otpExpiry: '',
    buttons: [],
  });

  // Validation functions
  const validateBodyText = (text) => {
    if (!text) return 'Body text is required.';
    const placeholders = text.match(/{{[a-z0-9_]+|[0-9]+}}/g) || [];
    
    if (templateType === 'AUTHENTICATION') {
      if (placeholders.length !== 1 || placeholders[0] !== '{{1}}') {
        return 'Authentication templates must contain exactly one {{1}} placeholder.';
      }
    } else {
      // NEW: Enforce strict format based on selection
      if (parameterFormat === 'POSITIONAL') {
        const named = text.match(/{{[a-z0-9_]+}}/g);
        if (named && named.length > 0) {
          return 'Positional format does not allow named placeholders like {{variable}}. Use {{1}}, {{2}}, etc.';
        }
        const positional = text.match(/{{[0-9]+}}/g);
        if (positional && positional.length > 0) {
          // NEW: Enforce sequential starting from 1 (removes gaps/duplicates)
          const nums = positional.map(p => parseInt(p.replace(/{{|}}/g, '')));
          const uniqueNums = [...new Set(nums)].sort((a, b) => a - b);
          if (uniqueNums[0] !== 1 || uniqueNums.some((n, i) => n !== i + 1)) {
            return 'Positional placeholders must start from {{1}} and be sequential without gaps or duplicates.';
          }
        }
      } else if (parameterFormat === 'NAMED') {
        const positional = text.match(/{{[0-9]+}}/g);
        if (positional && positional.length > 0) {
          return 'Named format does not allow positional placeholders like {{1}}. Use {{variable_name}}.';
        }
        const named = text.match(/{{[a-z0-9_]+}}/g);
        if (named && named.some(p => !p.match(/{{[a-z0-9_]+}}/))) {
          return 'Named placeholders must contain only lowercase letters, numbers, and underscores (e.g., {{first_name}}).';
        }
      }
      // NEW: Check for malformed placeholders
      const allPlaceholders = text.match(/{{.+?}}/g) || [];
      if (allPlaceholders.some(p => !p.match(/{{[a-z0-9_]+}}|{{[0-9]+}}/))) {
        return 'Invalid placeholder format. Use {{1}} for positional or {{variable}} for named.';
      }
    }
    return '';
  };

  const validateHeaderText = (text) => {
    return headerEnabled && headerType === 'TEXT' && !text ? 'Header text is required.' : '';
  };

  const validateFooterText = (text) => {
    return footerEnabled && !text ? 'Footer text is required.' : '';
  };

  const validateFlowFields = () => {
    if (!flowEnabled) return { flowId: '', flowButtonText: '' };
    return {
      flowId: flowId ? '' : 'Flow ID is required.',
      flowButtonText: flowButtonText ? '' : 'Flow button text is required.',
    };
  };

  const validateCouponCode = (code) => {
    return marketingType === 'COUPON' && !code ? 'Coupon code is required.' : '';
  };

  const validateLimitedTimeOfferText = (text) => {
    return marketingType === 'LIMITED_TIME_OFFER' && hasExpiration && !text ? 'Offer text is required.' : '';
  };

  const validateCarouselCardCount = (count) => {
    return ['MEDIA_CAROUSEL', 'PRODUCT_CAROUSEL'].includes(marketingType) &&
      (Number(count) < 2 || Number(count) > 10)
      ? 'Card count must be between 2 and 10.'
      : '';
  };

  const validateCatalogId = (id) => {
    return ['CATALOG', 'PRODUCT_CAROUSEL', 'MPM', 'SPM'].includes(marketingType) && !id
      ? 'Catalog ID is required.'
      : '';
  };

  const validateCatalogThumbnailId = (id) => {
    return marketingType === 'CATALOG' && !id ? 'Catalog thumbnail ID is required.' : '';
  };

  const validateSpmProductId = (id) => {
    return marketingType === 'SPM' && !id ? 'Product ID is required.' : '';
  };

  const validateMpmSections = () => {
    if (marketingType !== 'MPM') return [];
    return mpmSections.map((section) => ({
      title: section.title ? '' : 'Section title is required.',
      products: Array.isArray(section.productItems)
        ? section.productItems.map((product) =>
            product.product_retailer_id ? '' : 'Product ID is required.'
          )
        : [],
    }));
  };

  const validateHeaderMediaId = (id) => {
    return headerEnabled && ['IMAGE', 'VIDEO', 'DOCUMENT'].includes(headerType) && headerMediaType === 'id' && !id
      ? 'Media ID is required.'
      : '';
  };

  const validateHeaderMediaLink = (link) => {
    return headerEnabled && ['IMAGE', 'VIDEO', 'DOCUMENT'].includes(headerType) && headerMediaType === 'link' && !link
      ? 'Media link is required.'
      : '';
  };

  const validateHeaderLocationName = (name) => {
    return headerEnabled && headerType === 'LOCATION' && !name ? 'Location name is required.' : '';
  };

  const validateHeaderLocationAddress = (address) => {
    return headerEnabled && headerType === 'LOCATION' && !address ? 'Location address is required.' : '';
  };

  const validateHeaderLocationLatitude = (lat) => {
    return headerEnabled && headerType === 'LOCATION' && (!lat || isNaN(lat) || lat < -90 || lat > 90)
      ? 'Valid latitude (-90 to 90) is required.'
      : '';
  };

  const validateHeaderLocationLongitude = (lon) => {
    return headerEnabled && headerType === 'LOCATION' && (!lon || isNaN(lon) || lon < -180 || lon > 180)
      ? 'Valid longitude (-180 to 180) is required.'
      : '';
  };

  const validateOtpExpiry = (expiry) => {
    return templateType === 'AUTHENTICATION' && (!expiry || isNaN(expiry) || expiry <= 0 || expiry > 1440)
      ? 'OTP expiry must be between 1 and 1440 minutes.'
      : '';
  };

  const validateButtons = () => {
    if (!buttonsEnabled || templateType === 'AUTHENTICATION') return [];
    const validSubTypes = category === 'UTILITY'
      ? ['quick_reply', 'phone_number', 'url']
      : ['quick_reply', 'phone_number', 'url', 'catalog'];
    return buttons.map((button) => ({
      text: button.text ? '' : 'Button text is required.',
      parameter: button.parameters[0] && validSubTypes.includes(button.sub_type)
        ? ''
        : 'Button parameter is required or button type is invalid for the selected category.',
    }));
  };

  useEffect(() => {
    const { flowId, flowButtonText } = validateFlowFields();
    setLocalErrors({
      bodyText: validateBodyText(bodyText),
      headerText: validateHeaderText(headerText),
      footerText: validateFooterText(footerText),
      flowId,
      flowButtonText,
      couponCode: validateCouponCode(couponCode),
      limitedTimeOfferText: validateLimitedTimeOfferText(limitedTimeOfferText),
      carouselCardCount: validateCarouselCardCount(carouselCardCount),
      catalogId: validateCatalogId(catalogId),
      catalogThumbnailId: validateCatalogThumbnailId(catalogThumbnailId),
      spmProductId: validateSpmProductId(spmProductId),
      mpmSections: validateMpmSections(),
      headerMediaId: validateHeaderMediaId(headerMediaId),
      headerMediaLink: validateHeaderMediaLink(headerMediaLink),
      headerLocationName: validateHeaderLocationName(headerLocationName),
      headerLocationAddress: validateHeaderLocationAddress(headerLocationAddress),
      headerLocationLatitude: validateHeaderLocationLatitude(headerLocationLatitude),
      headerLocationLongitude: validateHeaderLocationLongitude(headerLocationLongitude),
      otpExpiry: validateOtpExpiry(otpExpiry),
      buttons: validateButtons(),
    });
  }, [
    bodyText,
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
    footerEnabled,
    footerText,
    buttonsEnabled,
    buttons,
    flowEnabled,
    flowId,
    flowButtonText,
    couponCode,
    limitedTimeOfferText,
    hasExpiration,
    carouselCardCount,
    catalogId,
    catalogThumbnailId,
    spmProductId,
    mpmSections,
    otpExpiry,
    templateType,
    marketingType,
    category,
    parameterFormat,
  ]);

  const handleBodyTextChange = (e) => {
    const value = e.target.value;
    setBodyText(value);
    setTouched('bodyText');

    const placeholderRegex = /{{[a-z0-9_]+|[0-9]+}}/g;
    const placeholders = value.match(placeholderRegex) || [];
    const newParameters = placeholders.map((placeholder, index) => ({
      id: `${placeholder}-${index}`,
      type: bodyParameters[index]?.type || 'text',
      placeholder,
    }));
    setBodyParameters(newParameters);

    const newSampleValues = parameterFormat === 'NAMED'
      ? placeholders.reduce((acc, placeholder) => ({
          ...acc,
          [placeholder.replace(/[{}]/g, '')]: sampleValues[placeholder.replace(/[{}]/g, '')] || { value: '', type: 'text' },
        }), {})
      : placeholders.map((placeholder, index) => sampleValues[index] || { value: '', type: 'text' });
    handleSampleChange(null, newSampleValues, null);
  };

  const handleHeaderEnabledChange = (e) => {
    setHeaderEnabled(e.target.checked);
    setTouched('headerEnabled');
  };

  const handleHeaderTypeChange = (e) => {
    setHeaderType(e.target.value);
    setTouched('headerType');
  };

  const handleHeaderTextChange = (e) => {
    setHeaderText(e.target.value);
    setTouched('headerText');
  };

  const handleHeaderMediaIdChange = (e) => {
    setHeaderMediaId(e.target.value);
    setTouched('headerMediaId');
  };

  const handleHeaderMediaLinkChange = (e) => {
    setHeaderMediaLink(e.target.value);
    setTouched('headerMediaLink');
  };

  const handleHeaderLocationNameChange = (e) => {
    setHeaderLocationName(e.target.value);
    setTouched('headerLocationName');
  };

  const handleHeaderLocationAddressChange = (e) => {
    setHeaderLocationAddress(e.target.value);
    setTouched('headerLocationAddress');
  };

  const handleHeaderLocationLatitudeChange = (e) => {
    setHeaderLocationLatitude(e.target.value);
    setTouched('headerLocationLatitude');
  };

  const handleHeaderLocationLongitudeChange = (e) => {
    setHeaderLocationLongitude(e.target.value);
    setTouched('headerLocationLongitude');
  };

  const handleFooterEnabledChange = (e) => {
    setFooterEnabled(e.target.checked);
    setTouched('footerEnabled');
  };

  const handleFooterTextChange = (e) => {
    setFooterText(e.target.value);
    setTouched('footerText');
  };

  const handleButtonsEnabledChange = (e) => {
    setButtonsEnabled(e.target.checked);
    setTouched('buttonsEnabled');
  };

  const handleFlowEnabledChange = (e) => {
    setFlowEnabled(e.target.checked);
    setTouched('flowEnabled');
  };

  const handleFlowIdChange = (e) => {
    setFlowId(e.target.value);
    setTouched('flowId');
  };

  const handleFlowButtonTextChange = (e) => {
    setFlowButtonText(e.target.value);
    setTouched('flowButtonText');
  };

  const handleFlowActionChange = (e) => {
    setFlowAction(e.target.value);
    setTouched('flowAction');
  };

  const handleFlowTokenChange = (e) => {
    setFlowToken(e.target.value);
    setTouched('flowToken');
  };

  const handleFlowMessageVersionChange = (e) => {
    setFlowMessageVersion(e.target.value);
    setTouched('flowMessageVersion');
  };

  const handleOtpButtonTypeChange = (e) => {
    setOtpButtonType(e.target.value);
    setTouched('otpButtonType');
  };

  const handleOtpExpiryChange = (e) => {
    setOtpExpiry(e.target.value);
    setTouched('otpExpiry');
  };

  const handleCouponCodeChange = (e) => {
    setCouponCode(e.target.value);
    setTouched('couponCode');
  };

  const handleHasExpirationChange = (e) => {
    setHasExpiration(e.target.checked);
    setTouched('hasExpiration');
  };

  const handleLimitedTimeOfferTextChange = (e) => {
    setLimitedTimeOfferText(e.target.value);
    setTouched('limitedTimeOfferText');
  };

  const handleCarouselCardCountChange = (e) => {
    setCarouselCardCount(e.target.value);
    setTouched('carouselCardCount');
  };

  const handleCatalogIdChange = (e) => {
    setCatalogId(e.target.value);
    setTouched('catalogId');
  };

  const handleCatalogThumbnailIdChange = (e) => {
    setCatalogThumbnailId(e.target.value);
    setTouched('catalogThumbnailId');
  };

  const handleSpmProductIdChange = (e) => {
    setSpmProductId(e.target.value);
    setTouched('spmProductId');
  };

  const handleMpmSectionTitleChange = (index, value) => {
    const newSections = [...mpmSections];
    newSections[index].title = value;
    setMpmSections(newSections);
    setTouched('mpmSections');
  };

  const handleMpmProductIdChange = (sectionIndex, productIndex, value) => {
    const newSections = [...mpmSections];
    newSections[sectionIndex].productItems[productIndex].product_retailer_id = value;
    setMpmSections(newSections);
    setTouched('mpmSections');
  };

  // Extract currency input values to avoid complex JSX expressions
  const getCurrencyCodeValue = (param, index) => {
    if (parameterFormat === 'NAMED') {
      return sampleValues[param.placeholder.replace(/[{}]/g, '')]?.value?.code ?? '';
    }
    return sampleValues[index]?.value?.code ?? '';
  };

  const getCurrencyAmountValue = (param, index) => {
    if (parameterFormat === 'NAMED') {
      return sampleValues[param.placeholder.replace(/[{}]/g, '')]?.value?.amount_1000 ?? '';
    }
    return sampleValues[index]?.value?.amount_1000 ?? '';
  };

  return (
    <div
      style={{
        marginBottom: '32px',
      }}
      role="region"
      aria-label="Template components"
    >
      {/* Header Section */}
      {['CUSTOM', 'COUPON', 'LIMITED_TIME_OFFER', 'FLOW', 'SPM', 'PRODUCT_CAROUSEL', 'CATALOG'].includes(templateType) && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <input
              type="checkbox"
              id="header-enabled"
              checked={headerEnabled}
              onChange={handleHeaderEnabledChange}
              style={{ marginRight: '8px', accentColor: '#2563EB' }}
              aria-label="Enable header"
            />
            <label
              htmlFor="header-enabled"
              style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1F2937',
              }}
            >
              Header
            </label>
          </div>
          <p
            id="header-enabled-help"
            style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              marginTop: '8px',
              marginBottom: '16px',
              fontWeight: '400',
            }}
          >
            Enable to include a header with text, media, or location. Headers appear at the top of the message.
          </p>
          {headerEnabled && (
            <div style={{ marginLeft: '24px' }}>
              <label
                htmlFor="header-type"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Header Type
              </label>
              <select
                id="header-type"
                value={headerType}
                onChange={handleHeaderTypeChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#374151',
                }}
                aria-label="Header type"
                aria-describedby="header-type-help"
              >
                <option value="TEXT">Text</option>
                <option value="IMAGE">Image</option>
                <option value="VIDEO">Video</option>
                <option value="DOCUMENT">Document</option>
                <option value="LOCATION">Location</option>
                {marketingType === 'PRODUCT_CAROUSEL' && <option value="PRODUCT">Product</option>}
              </select>
              <p
                id="header-type-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Choose the type of header: text, image, video, document, location, or product (for product carousels).
              </p>
              {headerType === 'TEXT' && (
                <div style={{ marginTop: '16px' }}>
                  <label
                    htmlFor="header-text"
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Header Text
                  </label>
                  <input
                    id="header-text"
                    type="text"
                    value={headerText}
                    onChange={handleHeaderTextChange}
                    placeholder="Enter header text"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: touched.headerText && localErrors.headerText ? '1px solid #DC2626' : '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      color: '#374151',
                    }}
                    aria-label="Header text"
                    aria-invalid={!!(touched.headerText && localErrors.headerText)}
                    aria-describedby={touched.headerText && localErrors.headerText ? 'header-text-error' : 'header-text-help'}
                  />
                  <p
                    id="header-text-help"
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Enter the text to display in the header. Keep it concise and relevant to the message.
                  </p>
                  {touched.headerText && localErrors.headerText && (
                    <p
                      id="header-text-error"
                      style={{
                        fontSize: '0.75rem',
                        color: '#DC2626',
                        marginTop: '4px',
                        fontWeight: '400',
                      }}
                    >
                      {localErrors.headerText}
                    </p>
                  )}
                </div>
              )}
              {['IMAGE', 'VIDEO', 'DOCUMENT'].includes(headerType) && (
                <div style={{ marginTop: '16px' }}>
                  <label
                    htmlFor="header-media-type"
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Media Type
                  </label>
                  <select
                    id="header-media-type"
                    value={headerMediaType}
                    onChange={(e) => setHeaderMediaType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      color: '#374151',
                    }}
                    aria-label="Media type"
                    aria-describedby="header-media-type-help"
                  >
                    <option value="id">Media ID</option>
                    <option value="link">Media Link</option>
                    <option value="file">Upload File</option>
                  </select>
                  <p
                    id="header-media-type-help"
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Specify how to provide the media: via a Media ID, a direct URL link, or by uploading a file.
                  </p>
                  {headerMediaType === 'id' && (
                    <div style={{ marginTop: '8px' }}>
                      <label
                        htmlFor="header-media-id"
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '8px',
                          display: 'block',
                        }}
                      >
                        Media ID
                      </label>
                      <input
                        id="header-media-id"
                        type="text"
                        value={headerMediaId}
                        onChange={handleHeaderMediaIdChange}
                        placeholder="Enter media ID"
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: touched.headerMediaId && localErrors.headerMediaId ? '1px solid #DC2626' : '1px solid #D1D5DB',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          color: '#374151',
                        }}
                        aria-label="Media ID"
                        aria-invalid={!!(touched.headerMediaId && localErrors.headerMediaId)}
                        aria-describedby={touched.headerMediaId && localErrors.headerMediaId ? 'header-media-id-error' : 'header-media-id-help'}
                      />
                      <p
                        id="header-media-id-help"
                        style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          marginTop: '8px',
                          fontWeight: '400',
                        }}
                      >
                        Enter the Media ID obtained from the Resumable Upload API for the image, video, or document.
                      </p>
                      {touched.headerMediaId && localErrors.headerMediaId && (
                        <p
                          id="header-media-id-error"
                          style={{
                            fontSize: '0.75rem',
                            color: '#DC2626',
                            marginTop: '4px',
                            fontWeight: '400',
                          }}
                        >
                          {localErrors.headerMediaId}
                        </p>
                      )}
                    </div>
                  )}
                  {headerMediaType === 'link' && (
                    <div style={{ marginTop: '8px' }}>
                      <label
                        htmlFor="header-media-link"
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '8px',
                          display: 'block',
                        }}
                      >
                        Media Link
                      </label>
                      <input
                        id="header-media-link"
                        type="text"
                        value={headerMediaLink}
                        onChange={handleHeaderMediaLinkChange}
                        placeholder="Enter media link"
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: touched.headerMediaLink && localErrors.headerMediaLink ? '1px solid #DC2626' : '1px solid #D1D5DB',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          color: '#374151',
                        }}
                        aria-label="Media link"
                        aria-invalid={!!(touched.headerMediaLink && localErrors.headerMediaLink)}
                        aria-describedby={touched.headerMediaLink && localErrors.headerMediaLink ? 'header-media-link-error' : 'header-media-link-help'}
                      />
                      <p
                        id="header-media-link-help"
                        style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          marginTop: '8px',
                          fontWeight: '400',
                        }}
                      >
                        Provide a direct URL to the image, video, or document. Ensure the link is accessible.
                      </p>
                      {touched.headerMediaLink && localErrors.headerMediaLink && (
                        <p
                          id="header-media-link-error"
                          style={{
                            fontSize: '0.75rem',
                            color: '#DC2626',
                            marginTop: '4px',
                            fontWeight: '400',
                          }}
                        >
                          {localErrors.headerMediaLink}
                        </p>
                      )}
                    </div>
                  )}
                  {headerMediaType === 'file' && (
                    <div style={{ marginTop: '8px' }}>
                      <label
                        htmlFor="header-file"
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '8px',
                          display: 'block',
                        }}
                      >
                        Upload File
                      </label>
                      <input
                        id="header-file"
                        type="file"
                        onChange={handleFileChange}
                        accept={headerType === 'IMAGE' ? 'image/*' : headerType === 'VIDEO' ? 'video/*' : '.pdf,.doc,.docx'}
                        style={{ width: '100%', padding: '10px' }}
                        aria-label="Upload header file"
                        aria-describedby="header-file-help"
                      />
                      <p
                        id="header-file-help"
                        style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          marginTop: '8px',
                          fontWeight: '400',
                        }}
                      >
                        Upload an image, video, or document file to include in the header. Ensure it meets WhatsApp’s media requirements.
                      </p>
                    </div>
                  )}
                </div>
              )}
              {headerType === 'LOCATION' && (
                <div style={{ marginTop: '16px' }}>
                  <label
                    htmlFor="header-location-name"
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Location Name
                  </label>
                  <input
                    id="header-location-name"
                    type="text"
                    value={headerLocationName}
                    onChange={handleHeaderLocationNameChange}
                    placeholder="Enter location name"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: touched.headerLocationName && localErrors.headerLocationName ? '1px solid #DC2626' : '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      color: '#374151',
                    }}
                    aria-label="Location name"
                    aria-invalid={!!(touched.headerLocationName && localErrors.headerLocationName)}
                    aria-describedby={touched.headerLocationName && localErrors.headerLocationName ? 'header-location-name-error' : 'header-location-name-help'}
                  />
                  <p
                    id="header-location-name-help"
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Enter the name of the location to display in the header.
                  </p>
                  {touched.headerLocationName && localErrors.headerLocationName && (
                    <p
                      id="header-location-name-error"
                      style={{
                        fontSize: '0.75rem',
                        color: '#DC2626',
                        marginTop: '4px',
                        fontWeight: '400',
                      }}
                    >
                      {localErrors.headerLocationName}
                    </p>
                  )}
                  <label
                    htmlFor="header-location-address"
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px',
                      display: 'block',
                      marginTop: '8px',
                    }}
                  >
                    Location Address
                  </label>
                  <input
                    id="header-location-address"
                    type="text"
                    value={headerLocationAddress}
                    onChange={handleHeaderLocationAddressChange}
                    placeholder="Enter location address"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: touched.headerLocationAddress && localErrors.headerLocationAddress ? '1px solid #DC2626' : '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      color: '#374151',
                    }}
                    aria-label="Location address"
                    aria-invalid={!!(touched.headerLocationAddress && localErrors.headerLocationAddress)}
                    aria-describedby={touched.headerLocationAddress && localErrors.headerLocationAddress ? 'header-location-address-error' : 'header-location-address-help'}
                  />
                  <p
                    id="header-location-address-help"
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Provide the full address of the location to be shown in the header.
                  </p>
                  {touched.headerLocationAddress && localErrors.headerLocationAddress && (
                    <p
                      id="header-location-address-error"
                      style={{
                        fontSize: '0.75rem',
                        color: '#DC2626',
                        marginTop: '4px',
                        fontWeight: '400',
                      }}
                    >
                      {localErrors.headerLocationAddress}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <label
                        htmlFor="header-location-latitude"
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '8px',
                          display: 'block',
                        }}
                      >
                        Latitude
                      </label>
                      <input
                        id="header-location-latitude"
                        type="number"
                        value={headerLocationLatitude}
                        onChange={handleHeaderLocationLatitudeChange}
                        placeholder="Enter latitude"
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: touched.headerLocationLatitude && localErrors.headerLocationLatitude ? '1px solid #DC2626' : '1px solid #D1D5DB',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          color: '#374151',
                        }}
                        aria-label="Location latitude"
                        aria-invalid={!!(touched.headerLocationLatitude && localErrors.headerLocationLatitude)}
                        aria-describedby={touched.headerLocationLatitude && localErrors.headerLocationLatitude ? 'header-location-latitude-error' : 'header-location-latitude-help'}
                      />
                      <p
                        id="header-location-latitude-help"
                        style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          marginTop: '8px',
                          fontWeight: '400',
                        }}
                      >
                        Enter the latitude of the location (-90 to 90).
                      </p>
                      {touched.headerLocationLatitude && localErrors.headerLocationLatitude && (
                        <p
                          id="header-location-latitude-error"
                          style={{
                            fontSize: '0.75rem',
                            color: '#DC2626',
                            marginTop: '4px',
                            fontWeight: '400',
                          }}
                        >
                          {localErrors.headerLocationLatitude}
                        </p>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <label
                        htmlFor="header-location-longitude"
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '8px',
                          display: 'block',
                        }}
                      >
                        Longitude
                      </label>
                      <input
                        id="header-location-longitude"
                        type="number"
                        value={headerLocationLongitude}
                        onChange={handleHeaderLocationLongitudeChange}
                        placeholder="Enter longitude"
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: touched.headerLocationLongitude && localErrors.headerLocationLongitude ? '1px solid #DC2626' : '1px solid #D1D5DB',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          color: '#374151',
                        }}
                        aria-label="Location longitude"
                        aria-invalid={!!(touched.headerLocationLongitude && localErrors.headerLocationLongitude)}
                        aria-describedby={touched.headerLocationLongitude && localErrors.headerLocationLongitude ? 'header-location-longitude-error' : 'header-location-longitude-help'}
                      />
                      <p
                        id="header-location-longitude-help"
                        style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          marginTop: '8px',
                          fontWeight: '400',
                        }}
                      >
                        Enter the longitude of the location (-180 to 180).
                      </p>
                      {touched.headerLocationLongitude && localErrors.headerLocationLongitude && (
                        <p
                          id="header-location-longitude-error"
                          style={{
                            fontSize: '0.75rem',
                            color: '#DC2626',
                            marginTop: '4px',
                            fontWeight: '400',
                          }}
                        >
                          {localErrors.headerLocationLongitude}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Body Section */}
      <div style={{ marginBottom: '24px' }}>
        <label
          htmlFor="body-text"
          style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1F2937',
            marginBottom: '16px',
            display: 'block',
          }}
        >
          Body
        </label>
        <div style={{ position: 'relative' }}>
          <textarea
            ref={textareaRef}
            id="body-text"
            value={bodyText}
            onChange={handleBodyTextChange}
            placeholder="Enter body text"
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '10px',
              border: touched.bodyText && localErrors.bodyText ? '1px solid #DC2626' : '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#374151',
            }}
            aria-label="Body text"
            aria-invalid={!!(touched.bodyText && localErrors.bodyText)}
            aria-describedby={touched.bodyText && localErrors.bodyText ? 'body-text-error' : 'body-text-help'}
          />
          <p
            id="body-text-help"
            style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              marginTop: '8px',
              fontWeight: '400',
            }}
          >
            Enter the main message content. Use placeholders like <code>{'{{1}}'}</code> for positional or <code>{'{{variable_name}}'}</code> for named format, based on the selected parameter format.
          </p>
          {templateType !== 'AUTHENTICATION' && (
            <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '4px' }}>
              <Tooltip title="Bold">
                <IconButton onClick={() => applyFormatting('bold')} aria-label="Bold text">
                  <FormatBold />
                </IconButton>
              </Tooltip>
              <Tooltip title="Italic">
                <IconButton onClick={() => applyFormatting('italic')} aria-label="Italic text">
                  <FormatItalic />
                </IconButton>
              </Tooltip>
              <Tooltip title="Strikethrough">
                <IconButton onClick={() => applyFormatting('strikethrough')} aria-label="Strikethrough text">
                  <FormatUnderlined />
                </IconButton>
              </Tooltip>
            </div>
          )}
          {touched.bodyText && localErrors.bodyText && (
            <p
              id="body-text-error"
              style={{
                fontSize: '0.75rem',
                color: '#DC2626',
                marginTop: '4px',
                fontWeight: '400',
              }}
            >
              {localErrors.bodyText}
            </p>
          )}
        </div>
        {bodyParameters.map((param, index) => (
          <div key={`${param.placeholder}-${index}`} style={{ marginTop: '16px' }}>
            <label
              htmlFor={`sample-type-${index}`}
              style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px',
                display: 'block',
              }}
            >
              Sample Type for {parameterFormat === 'NAMED' ? param.placeholder.replace(/[{}]/g, '') : `${index + 1}`}
            </label>
            <select
              id={`sample-type-${index}`}
              value={param.type}
              onChange={(e) => {
                const newParameters = [...bodyParameters];
                newParameters[index].type = e.target.value;
                setBodyParameters(newParameters);
                handleSampleChange(
                  parameterFormat === 'NAMED' ? param.placeholder.replace(/[{}]/g, '') : index,
                  parameterFormat === 'NAMED' ? { value: sampleValues[param.placeholder.replace(/[{}]/g, '')]?.value || '', type: e.target.value } : sampleValues[index]?.value || '',
                  e.target.value
                );
              }}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#374151',
              }}
              aria-label={`Sample type for placeholder ${parameterFormat === 'NAMED' ? param.placeholder.replace(/[{}]/g, '') : `${index + 1}`}`}
              aria-describedby={`sample-type-${index}-help`}
            >
              <option value="text">Text</option>
              <option value="currency">Currency</option>
              <option value="date_time">Date/Time</option>
            </select>
            <p
              id={`sample-type-${index}-${param.placeholder}-help`}
              style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                marginTop: '8px',
                fontWeight: '400',
              }}
            >
              Select the type of data for the placeholder (text, currency, or date/time).
            </p>
            {param.type === 'currency' ? (
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label
                    htmlFor={`sample-currency-code-${index}`}
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Currency Code
                  </label>
                  <input
                    id={`sample-currency-code-${index}`}
                    type="text"
                    value={getCurrencyCodeValue(param, index)}
                    onChange={(e) => {
                      const key = parameterFormat === 'NAMED' ? param.placeholder.replace(/[{}]/g, '') : index;
                      handleSampleChange(key, { 
                        code: e.target.value, 
                        amount_1000: getCurrencyAmountValue(param, index) 
                      }, 'currency');
                    }}
                    placeholder="USD"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      color: '#374151',
                    }}
                    aria-label={`Currency code for ${parameterFormat === 'NAMED' ? param.placeholder.replace(/[{}]/g, '') : `{{${index + 1}}`}`}
                    aria-describedby={`sample-currency-code-${index}-help`}
                  />
                  <p
                    id={`sample-currency-code-${index}-help`}
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Enter the currency code (e.g., USD, INR) for the placeholder.
                  </p>
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    htmlFor={`sample-currency-amount-${index}`}
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Amount (x1000)
                  </label>
                  <input
                    id={`sample-currency-amount-${index}`}
                    type="number"
                    value={getCurrencyAmountValue(param, index)}
                    onChange={(e) => {
                      const key = parameterFormat === 'NAMED' ? param.placeholder.replace(/[{}]/g, '') : index;
                      handleSampleChange(key, { 
                        code: getCurrencyCodeValue(param, index), 
                        amount_1000: e.target.value 
                      }, 'currency');
                    }}
                    placeholder="1000"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      color: '#374151',
                    }}
                    aria-label={`Currency amount for ${parameterFormat === 'NAMED' ? param.placeholder.replace(/[{}]/g, '') : `{{${index + 1}}`}`}
                    aria-describedby={`sample-currency-amount-${index}-help`}
                  />
                  <p
                    id={`sample-currency-amount-${index}-help`}
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Enter the amount multiplied by 1000 (e.g., 1000 for 1.00).
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '8px' }}>
                <label
                  htmlFor={`sample-value-${index}`}
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  Sample Value for {parameterFormat === 'NAMED' ? param.placeholder.replace(/[{}]/g, '') : `{{${index + 1}}`}
                </label>
                <input
                  id={`sample-value-${index}`}
                  type={param.type === 'date_time' ? 'datetime-local' : 'text'}
                  value={
                    parameterFormat === 'NAMED'
                      ? sampleValues[param.placeholder.replace(/[{}]/g, '')]?.value ?? ''
                      : sampleValues[index]?.value ?? ''
                  }
                  onChange={(e) => {
                    const key = parameterFormat === 'NAMED' ? param.placeholder.replace(/[{}]/g, '') : index;
                    handleSampleChange(key, e.target.value, param.type);
                  }}
                  placeholder={`Enter sample for ${parameterFormat === 'NAMED' ? param.placeholder.replace(/[{}]/g, '') : `{{${index + 1}}`}`}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: '#374151',
                  }}
                  aria-label={`Sample value for ${parameterFormat === 'NAMED' ? param.placeholder.replace(/[{}]/g, '') : `{{${index + 1}}`}`}
                  aria-describedby={`sample-value-${index}-help`}
                />
                <p
                  id={`sample-value-${index}-help`}
                  style={{
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    marginTop: '8px',
                    fontWeight: '400',
                  }}
                >
                  Provide a sample value for the placeholder to be used during template review.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Section */}
      {templateType !== 'AUTHENTICATION' && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <input
              type="checkbox"
              id="footer-enabled"
              checked={footerEnabled}
              onChange={handleFooterEnabledChange}
              style={{ marginRight: '8px', accentColor: '#2563EB' }}
              aria-label="Enable footer"
            />
            <label
              htmlFor="footer-enabled"
              style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1F2937',
              }}
            >
              Footer
            </label>
          </div>
          <p
            id="footer-enabled-help"
            style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              marginTop: '8px',
              marginBottom: '16px',
              fontWeight: '400',
            }}
          >
            Enable to include a footer with static text at the bottom of the message.
          </p>
          {footerEnabled && (
            <div style={{ marginLeft: '24px' }}>
              <label
                htmlFor="footer-text"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Footer Text
              </label>
              <input
                id="footer-text"
                type="text"
                value={footerText}
                onChange={handleFooterTextChange}
                placeholder="Enter footer text"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: touched.footerText && localErrors.footerText ? '1px solid #DC2626' : '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#374151',
                }}
                aria-label="Footer text"
                aria-invalid={!!(touched.footerText && localErrors.footerText)}
                aria-describedby={touched.footerText && localErrors.footerText ? 'footer-text-error' : 'footer-text-help'}
              />
              <p
                id="footer-text-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Enter static text for the footer, such as a disclaimer or contact info.
              </p>
              {touched.footerText && localErrors.footerText && (
                <p
                  id="footer-text-error"
                  style={{
                    fontSize: '0.75rem',
                    color: '#DC2626',
                    marginTop: '4px',
                    fontWeight: '400',
                  }}
                >
                  {localErrors.footerText}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Buttons Section */}
      {templateType !== 'AUTHENTICATION' && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <input
              type="checkbox"
              id="buttons-enabled"
              checked={buttonsEnabled}
              onChange={handleButtonsEnabledChange}
              style={{ marginRight: '8px', accentColor: '#2563EB' }}
              aria-label="Enable buttons"
            />
            <label
              htmlFor="buttons-enabled"
              style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1F2937',
              }}
            >
              Buttons
            </label>
          </div>
          <p
            id="buttons-enabled-help"
            style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              marginTop: '8px',
              marginBottom: '16px',
              fontWeight: '400',
            }}
          >
            Enable to add interactive buttons like Quick Reply, Phone Number, URL, or Catalog (Marketing only).
          </p>
          {buttonsEnabled && (
            <div style={{ marginLeft: '24px' }}>
              {buttons.map((button, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '16px',
                    padding: '16px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    backgroundColor: '#F9FAFB',
                  }}
                >
                  <label
                    htmlFor={`button-text-${index}`}
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Button Text
                  </label>
                  <input
                    id={`button-text-${index}`}
                    type="text"
                    value={button.text}
                    onChange={(e) => handleButtonChange(index, 'text', e.target.value)}
                    placeholder="Enter button text"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: touched.buttons && localErrors.buttons[index]?.text ? '1px solid #DC2626' : '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      color: '#374151',
                    }}
                    aria-label={`Button ${index + 1} text`}
                    aria-invalid={!!(touched.buttons && localErrors.buttons[index]?.text)}
                    aria-describedby={touched.buttons && localErrors.buttons[index]?.text ? `button-text-${index}-error` : `button-text-${index}-help`}
                  />
                  <p
                    id={`button-text-${index}-help`}
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Enter the text to display on the button (e.g., "Call Now", "Visit Website").
                  </p>
                  {touched.buttons && localErrors.buttons[index]?.text && (
                    <p
                      id={`button-text-${index}-error`}
                      style={{
                        fontSize: '0.75rem',
                        color: '#DC2626',
                        marginTop: '4px',
                        fontWeight: '400',
                      }}
                    >
                      {localErrors.buttons[index].text}
                    </p>
                  )}
                  <label
                    htmlFor={`button-sub-type-${index}`}
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px',
                      display: 'block',
                      marginTop: '8px',
                    }}
                  >
                    Button Type
                  </label>
                  <select
                    id={`button-sub-type-${index}`}
                    value={button.sub_type}
                    onChange={(e) => handleButtonChange(index, 'sub_type', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      color: '#374151',
                    }}
                    aria-label={`Button ${index + 1} type`}
                    aria-describedby={`button-sub-type-${index}-help`}
                  >
                    <option value="quick_reply">Quick Reply</option>
                    <option value="phone_number">Phone Number</option>
                    <option value="url">URL</option>
                    {category !== 'UTILITY' && <option value="catalog">Catalog</option>}
                  </select>
                  <p
                    id={`button-sub-type-${index}-help`}
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Select the button type: Quick Reply for custom responses, Phone Number, URL, or Catalog (Marketing only).
                  </p>
                  {(button.sub_type === 'url' ||
                    button.sub_type === 'phone_number' ||
                    button.sub_type === 'catalog') && (
                    <div style={{ marginTop: '8px' }}>
                      <label
                        htmlFor={`button-parameter-${index}`}
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '8px',
                          display: 'block',
                        }}
                      >
                        {button.sub_type === 'url'
                          ? 'URL'
                          : button.sub_type === 'phone_number'
                          ? 'Phone Number'
                          : 'Catalog ID'}
                      </label>
                      <input
                        id={`button-parameter-${index}`}
                        type="text"
                        value={button.parameters[0]?.[button.sub_type === 'url' ? 'text' : button.sub_type === 'phone_number' ? 'phone_number' : 'payload'] || ''}
                        onChange={(e) =>
                          handleButtonChange(index, 'parameters', [
                            {
                              [button.sub_type === 'url' ? 'text' : button.sub_type === 'phone_number' ? 'phone_number' : 'payload']: e.target.value,
                            },
                          ])
                        }
                        placeholder={
                          button.sub_type === 'url'
                            ? 'https://example.com'
                            : button.sub_type === 'phone_number'
                            ? '+1234567890'
                            : 'Catalog ID'
                        }
                        style={{
                          width: '100%',
                          padding: '10px',
                          border:
                            touched.buttons && localErrors.buttons[index]?.parameter
                              ? '1px solid #DC2626'
                              : '1px solid #D1D5DB',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          color: '#374151',
                        }}
                        aria-label={`Button ${index + 1} parameter`}
                        aria-invalid={!!(touched.buttons && localErrors.buttons[index]?.parameter)}
                        aria-describedby={
                          touched.buttons && localErrors.buttons[index]?.parameter
                            ? `button-parameter-${index}-error`
                            : `button-parameter-${index}-help`
                        }
                      />
                      <p
                        id={`button-parameter-${index}-help`}
                        style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          marginTop: '8px',
                          fontWeight: '400',
                        }}
                      >
                        {button.sub_type === 'url'
                          ? 'Enter the URL the button links to.'
                          : button.sub_type === 'phone_number'
                          ? 'Enter the phone number in international format (e.g., +1234567890).'
                          : 'Enter the catalog ID for the product catalog.'}
                      </p>
                      {touched.buttons && localErrors.buttons[index]?.parameter && (
                        <p
                          id={`button-parameter-${index}-error`}
                          style={{
                            fontSize: '0.75rem',
                            color: '#DC2626',
                            marginTop: '4px',
                            fontWeight: '400',
                          }}
                        >
                          {localErrors.buttons[index].parameter}
                        </p>
                      )}
                    </div>
                  )}
                  <IconButton
                    onClick={() => {
                      const newButtons = buttons.filter((_, i) => i !== index);
                      setButtons(newButtons);
                      setTouched('buttons');
                    }}
                    style={{ color: '#DC2626', marginTop: '8px' }}
                    aria-label={`Remove button ${index + 1}`}
                  >
                    <Delete />
                  </IconButton>
                </div>
              ))}
              {buttons.length < 10 && (
                <button
                  type="button"
                  onClick={handleAddButton}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #2563EB',
                    borderRadius: '8px',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    marginTop: '8px',
                  }}
                  aria-label="Add button"
                >
                  Add Button
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Flow Section */}
      {(templateType === 'FLOW' || marketingType === 'FLOW') && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <input
              type="checkbox"
              id="flow-enabled"
              checked={flowEnabled}
              onChange={handleFlowEnabledChange}
              style={{ marginRight: '8px', accentColor: '#2563EB' }}
              aria-label="Enable flow"
            />
            <label
              htmlFor="flow-enabled"
              style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1F2937',
              }}
            >
              Flow
            </label>
          </div>
          <p
            id="flow-enabled-help"
            style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              marginTop: '8px',
              marginBottom: '16px',
              fontWeight: '400',
            }}
          >
            Enable to include a flow for interactive user journeys, such as forms or menus.
          </p>
          {flowEnabled && (
            <div style={{ marginLeft: '24px' }}>
              <label
                htmlFor="flow-id"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Flow ID
              </label>
              <input
                id="flow-id"
                type="text"
                value={flowId}
                onChange={handleFlowIdChange}
                placeholder="Enter flow ID"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: touched.flowId && localErrors.flowId ? '1px solid #DC2626' : '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#374151',
                }}
                aria-label="Flow ID"
                aria-invalid={!!(touched.flowId && localErrors.flowId)}
                aria-describedby={touched.flowId && localErrors.flowId ? 'flow-id-error' : 'flow-id-help'}
              />
              <p
                id="flow-id-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Enter the unique ID of the flow to be triggered by this template.
              </p>
              {touched.flowId && localErrors.flowId && (
                <p
                  id="flow-id-error"
                  style={{
                    fontSize: '0.75rem',
                    color: '#DC2626',
                    marginTop: '4px',
                    fontWeight: '400',
                  }}
                >
                  {localErrors.flowId}
                </p>
              )}
              <label
                htmlFor="flow-button-text"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px',
                  display: 'block',
                  marginTop: '8px',
                }}
              >
                Flow Button Text
              </label>
              <input
                id="flow-button-text"
                type="text"
                value={flowButtonText}
                onChange={handleFlowButtonTextChange}
                placeholder="Enter flow button text"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: touched.flowButtonText && localErrors.flowButtonText ? '1px solid #DC2626' : '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#374151',
                }}
                aria-label="Flow button text"
                aria-invalid={!!(touched.flowButtonText && localErrors.flowButtonText)}
                aria-describedby={touched.flowButtonText && localErrors.flowButtonText ? 'flow-button-text-error' : 'flow-button-text-help'}
              />
              <p
                id="flow-button-text-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Enter the text for the button that triggers the flow (e.g., "Start Flow").
              </p>
              {touched.flowButtonText && localErrors.flowButtonText && (
                <p
                  id="flow-button-text-error"
                  style={{
                    fontSize: '0.75rem',
                    color: '#DC2626',
                    marginTop: '4px',
                    fontWeight: '400',
                  }}
                >
                  {localErrors.flowButtonText}
                </p>
              )}
              <label
                htmlFor="flow-action"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px',
                  display: 'block',
                  marginTop: '8px',
                }}
              >
                Flow Action
              </label>
              <select
                id="flow-action"
                value={flowAction}
                onChange={handleFlowActionChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#374151',
                }}
                aria-label="Flow action"
                aria-describedby="flow-action-help"
              >
                <option value="navigate">Navigate</option>
                <option value="data_exchange">Data Exchange</option>
              </select>
              <p
                id="flow-action-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Select the action for the flow: Navigate for screen transitions or Data Exchange for data submission.
              </p>
              <label
                htmlFor="flow-token"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px',
                  display: 'block',
                  marginTop: '8px',
                }}
              >
                Flow Token
              </label>
              <input
                id="flow-token"
                type="text"
                value={flowToken}
                onChange={handleFlowTokenChange}
                placeholder="Enter flow token"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#374151',
                }}
                aria-label="Flow token"
                aria-describedby="flow-token-help"
              />
              <p
                id="flow-token-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Enter an optional token to pass data to the flow for processing.
              </p>
              <label
                htmlFor="flow-message-version"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px',
                  display: 'block',
                  marginTop: '8px',
                }}
              >
                Flow Message Version
              </label>
              <input
                id="flow-message-version"
                type="text"
                value={flowMessageVersion}
                onChange={handleFlowMessageVersionChange}
                placeholder="Enter flow message version"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#374151',
                }}
                aria-label="Flow message version"
                aria-describedby="flow-message-version-help"
              />
              <p
                id="flow-message-version-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Specify the version of the flow message for compatibility.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Authentication Section */}
      {templateType === 'AUTHENTICATION' && (
        <div style={{ marginBottom: '24px' }}>
          <label
            htmlFor="otp-button-type"
            style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '16px',
              display: 'block',
            }}
          >
            OTP Button Type
          </label>
          <select
            id="otp-button-type"
            value={otpButtonType}
            onChange={handleOtpButtonTypeChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#374151',
            }}
            aria-label="OTP button type"
            aria-describedby="otp-button-type-help"
          >
            <option value="COPY_CODE">Copy Code</option>
            <option value="ONE_TAP_AUTOFILL">One-Tap Autofill</option>
          </select>
          <p
            id="otp-button-type-help"
            style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              marginTop: '8px',
              fontWeight: '400',
            }}
          >
            Choose the OTP button type: Copy Code for manual copying or One-Tap Autofill for automatic filling.
          </p>
          <label
            htmlFor="otp-expiry"
            style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px',
              display: 'block',
              marginTop: '16px',
            }}
          >
            OTP Expiry (minutes)
          </label>
          <input
            id="otp-expiry"
            type="number"
            value={otpExpiry}
            onChange={handleOtpExpiryChange}
            placeholder="Enter OTP expiry"
            style={{
              width: '100%',
              padding: '10px',
              border: touched.otpExpiry && localErrors.otpExpiry ? '1px solid #DC2626' : '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#374151',
            }}
            aria-label="OTP expiry"
            aria-invalid={!!(touched.otpExpiry && localErrors.otpExpiry)}
            aria-describedby={touched.otpExpiry && localErrors.otpExpiry ? 'otp-expiry-error' : 'otp-expiry-help'}
          />
          <p
            id="otp-expiry-help"
            style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              marginTop: '8px',
              fontWeight: '400',
            }}
          >
            Specify the OTP validity period in minutes (1 to 1440).
          </p>
          {touched.otpExpiry && localErrors.otpExpiry && (
            <p
              id="otp-expiry-error"
              style={{
                fontSize: '0.75rem',
                color: '#DC2626',
                marginTop: '4px',
                fontWeight: '400',
              }}
            >
              {localErrors.otpExpiry}
            </p>
          )}
        </div>
      )}

      {/* Coupon Section */}
      {marketingType === 'COUPON' && (
        <div style={{ marginBottom: '24px' }}>
          <label
            htmlFor="coupon-code"
            style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '16px',
              display: 'block',
            }}
          >
            Coupon Code
          </label>
          <input
            id="coupon-code"
            type="text"
            value={couponCode}
            onChange={handleCouponCodeChange}
            placeholder="Enter coupon code"
            style={{
              width: '100%',
              padding: '10px',
              border: touched.couponCode && localErrors.couponCode ? '1px solid #DC2626' : '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#374151',
            }}
            aria-label="Coupon code"
            aria-invalid={!!(touched.couponCode && localErrors.couponCode)}
            aria-describedby={touched.couponCode && localErrors.couponCode ? 'coupon-code-error' : 'coupon-code-help'}
          />
          <p
            id="coupon-code-help"
            style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              marginTop: '8px',
              fontWeight: '400',
            }}
          >
            Enter the coupon code to be included in the marketing template.
          </p>
          {touched.couponCode && localErrors.couponCode && (
            <p
              id="coupon-code-error"
              style={{
                fontSize: '0.75rem',
                color: '#DC2626',
                marginTop: '4px',
                fontWeight: '400',
              }}
            >
              {localErrors.couponCode}
            </p>
          )}
        </div>
      )}

      {/* Limited Time Offer Section */}
      {marketingType === 'LIMITED_TIME_OFFER' && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <input
              type="checkbox"
              id="has-expiration"
              checked={hasExpiration}
              onChange={handleHasExpirationChange}
              style={{ marginRight: '8px', accentColor: '#2563EB' }}
              aria-label="Enable expiration for limited time offer"
            />
            <label
              htmlFor="has-expiration"
              style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1F2937',
              }}
            >
              Limited Time Offer Expiration
            </label>
          </div>
          <p
            id="has-expiration-help"
            style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              marginTop: '8px',
              marginBottom: '16px',
              fontWeight: '400',
            }}
          >
            Enable to specify an expiration date for the limited time offer.
          </p>
          {hasExpiration && (
                        <div style={{ marginLeft: '24px' }}>
              <label
                htmlFor="limited-time-offer-text"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Offer Text
              </label>
              <input
                id="limited-time-offer-text"
                type="text"
                value={limitedTimeOfferText}
                onChange={handleLimitedTimeOfferTextChange}
                placeholder="Enter offer expiration text"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: touched.limitedTimeOfferText && localErrors.limitedTimeOfferText ? '1px solid #DC2626' : '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#374151',
                }}
                aria-label="Limited time offer text"
                aria-invalid={!!(touched.limitedTimeOfferText && localErrors.limitedTimeOfferText)}
                aria-describedby={touched.limitedTimeOfferText && localErrors.limitedTimeOfferText ? 'limited-time-offer-text-error' : 'limited-time-offer-text-help'}
              />
              <p
                id="limited-time-offer-text-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Enter the expiration details for the limited time offer (e.g., "Valid until 12/31/2025").
              </p>
              {touched.limitedTimeOfferText && localErrors.limitedTimeOfferText && (
                <p
                  id="limited-time-offer-text-error"
                  style={{
                    fontSize: '0.75rem',
                    color: '#DC2626',
                    marginTop: '4px',
                    fontWeight: '400',
                  }}
                >
                  {localErrors.limitedTimeOfferText}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Carousel Section */}
      {['MEDIA_CAROUSEL', 'PRODUCT_CAROUSEL'].includes(marketingType) && (
        <div style={{ marginBottom: '24px' }}>
          <label
            htmlFor="carousel-card-count"
            style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '16px',
              display: 'block',
            }}
          >
            Carousel Card Count
          </label>
          <input
            id="carousel-card-count"
            type="number"
            value={carouselCardCount}
            onChange={handleCarouselCardCountChange}
            placeholder="Enter number of cards (2-10)"
            style={{
              width: '100%',
              padding: '10px',
              border: touched.carouselCardCount && localErrors.carouselCardCount ? '1px solid #DC2626' : '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#374151',
            }}
            aria-label="Carousel card count"
            aria-invalid={!!(touched.carouselCardCount && localErrors.carouselCardCount)}
            aria-describedby={touched.carouselCardCount && localErrors.carouselCardCount ? 'carousel-card-count-error' : 'carousel-card-count-help'}
          />
          <p
            id="carousel-card-count-help"
            style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              marginTop: '8px',
              fontWeight: '400',
            }}
          >
            Specify the number of cards in the carousel (between 2 and 10).
          </p>
          {touched.carouselCardCount && localErrors.carouselCardCount && (
            <p
              id="carousel-card-count-error"
              style={{
                fontSize: '0.75rem',
                color: '#DC2626',
                marginTop: '4px',
                fontWeight: '400',
              }}
            >
              {localErrors.carouselCardCount}
            </p>
          )}
        </div>
      )}

      {/* Catalog Section */}
      {['CATALOG', 'PRODUCT_CAROUSEL', 'MPM', 'SPM'].includes(marketingType) && (
        <div style={{ marginBottom: '24px' }}>
          <label
            htmlFor="catalog-id"
            style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '16px',
              display: 'block',
            }}
          >
            Catalog ID
          </label>
          <input
            id="catalog-id"
            type="text"
            value={catalogId}
            onChange={handleCatalogIdChange}
            placeholder="Enter catalog ID"
            style={{
              width: '100%',
              padding: '10px',
              border: touched.catalogId && localErrors.catalogId ? '1px solid #DC2626' : '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#374151',
            }}
            aria-label="Catalog ID"
            aria-invalid={!!(touched.catalogId && localErrors.catalogId)}
            aria-describedby={touched.catalogId && localErrors.catalogId ? 'catalog-id-error' : 'catalog-id-help'}
          />
          <p
            id="catalog-id-help"
            style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              marginTop: '8px',
              fontWeight: '400',
            }}
          >
            Enter the unique ID of the catalog for product display.
          </p>
          {touched.catalogId && localErrors.catalogId && (
            <p
              id="catalog-id-error"
              style={{
                fontSize: '0.75rem',
                color: '#DC2626',
                marginTop: '4px',
                fontWeight: '400',
              }}
            >
              {localErrors.catalogId}
            </p>
          )}
          {marketingType === 'CATALOG' && (
            <div style={{ marginTop: '16px' }}>
              <label
                htmlFor="catalog-thumbnail-id"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Catalog Thumbnail ID
              </label>
              <input
                id="catalog-thumbnail-id"
                type="text"
                value={catalogThumbnailId}
                onChange={handleCatalogThumbnailIdChange}
                placeholder="Enter catalog thumbnail ID"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: touched.catalogThumbnailId && localErrors.catalogThumbnailId ? '1px solid #DC2626' : '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#374151',
                }}
                aria-label="Catalog thumbnail ID"
                aria-invalid={!!(touched.catalogThumbnailId && localErrors.catalogThumbnailId)}
                aria-describedby={touched.catalogThumbnailId && localErrors.catalogThumbnailId ? 'catalog-thumbnail-id-error' : 'catalog-thumbnail-id-help'}
              />
              <p
                id="catalog-thumbnail-id-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Enter the ID of the thumbnail image for the catalog.
              </p>
              {touched.catalogThumbnailId && localErrors.catalogThumbnailId && (
                <p
                  id="catalog-thumbnail-id-error"
                  style={{
                    fontSize: '0.75rem',
                    color: '#DC2626',
                    marginTop: '4px',
                    fontWeight: '400',
                  }}
                >
                  {localErrors.catalogThumbnailId}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* SPM Section */}
      {marketingType === 'SPM' && (
        <div style={{ marginBottom: '24px' }}>
          <label
            htmlFor="spm-product-id"
            style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '16px',
              display: 'block',
            }}
          >
            Product ID
          </label>
          <input
            id="spm-product-id"
            type="text"
            value={spmProductId}
            onChange={handleSpmProductIdChange}
            placeholder="Enter product ID"
            style={{
              width: '100%',
              padding: '10px',
              border: touched.spmProductId && localErrors.spmProductId ? '1px solid #DC2626' : '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#374151',
            }}
            aria-label="Product ID"
            aria-invalid={!!(touched.spmProductId && localErrors.spmProductId)}
            aria-describedby={touched.spmProductId && localErrors.spmProductId ? 'spm-product-id-error' : 'spm-product-id-help'}
          />
          <p
            id="spm-product-id-help"
            style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              marginTop: '8px',
              fontWeight: '400',
            }}
          >
            Enter the unique ID of the product for single product messaging.
          </p>
          {touched.spmProductId && localErrors.spmProductId && (
            <p
              id="spm-product-id-error"
              style={{
                fontSize: '0.75rem',
                color: '#DC2626',
                marginTop: '4px',
                fontWeight: '400',
              }}
            >
              {localErrors.spmProductId}
            </p>
          )}
        </div>
      )}

      {/* MPM Section */}
      {marketingType === 'MPM' && (
        <div style={{ marginBottom: '24px' }}>
          <label
            style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '16px',
              display: 'block',
            }}
          >
            Multi-Product Sections
          </label>
          {mpmSections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              style={{
                marginBottom: '16px',
                padding: '16px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                backgroundColor: '#F9FAFB',
              }}
            >
              <label
                htmlFor={`mpm-section-title-${sectionIndex}`}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Section Title
              </label>
              <input
                id={`mpm-section-title-${sectionIndex}`}
                type="text"
                value={section.title}
                onChange={(e) => handleMpmSectionTitleChange(sectionIndex, e.target.value)}
                placeholder="Enter section title"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: touched.mpmSections && localErrors.mpmSections[sectionIndex]?.title ? '1px solid #DC2626' : '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#374151',
                }}
                aria-label={`Section ${sectionIndex + 1} title`}
                aria-invalid={!!(touched.mpmSections && localErrors.mpmSections[sectionIndex]?.title)}
                aria-describedby={touched.mpmSections && localErrors.mpmSections[sectionIndex]?.title ? `mpm-section-title-${sectionIndex}-error` : `mpm-section-title-${sectionIndex}-help`}
              />
              <p
                id={`mpm-section-title-${sectionIndex}-help`}
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Enter the title for this product section (e.g., "Featured Products").
              </p>
              {touched.mpmSections && localErrors.mpmSections[sectionIndex]?.title && (
                <p
                  id={`mpm-section-title-${sectionIndex}-error`}
                  style={{
                    fontSize: '0.75rem',
                    color: '#DC2626',
                    marginTop: '4px',
                    fontWeight: '400',
                  }}
                >
                  {localErrors.mpmSections[sectionIndex].title}
                </p>
              )}
              {section.productItems.map((product, productIndex) => (
                <div key={productIndex} style={{ marginTop: '8px', marginLeft: '16px' }}>
                  <label
                    htmlFor={`mpm-product-id-${sectionIndex}-${productIndex}`}
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Product ID {productIndex + 1}
                  </label>
                  <input
                    id={`mpm-product-id-${sectionIndex}-${productIndex}`}
                    type="text"
                    value={product.product_retailer_id}
                    onChange={(e) => handleMpmProductIdChange(sectionIndex, productIndex, e.target.value)}
                    placeholder="Enter product ID"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border:
                        touched.mpmSections && localErrors.mpmSections[sectionIndex]?.products[productIndex]
                          ? '1px solid #DC2626'
                          : '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      color: '#374151',
                    }}
                    aria-label={`Section ${sectionIndex + 1} product ${productIndex + 1} ID`}
                    aria-invalid={!!(touched.mpmSections && localErrors.mpmSections[sectionIndex]?.products[productIndex])}
                    aria-describedby={
                      touched.mpmSections && localErrors.mpmSections[sectionIndex]?.products[productIndex]
                        ? `mpm-product-id-${sectionIndex}-${productIndex}-error`
                        : `mpm-product-id-${sectionIndex}-${productIndex}-help`
                    }
                  />
                  <p
                    id={`mpm-product-id-${sectionIndex}-${productIndex}-help`}
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Enter the unique ID for the product in this section.
                  </p>
                  {touched.mpmSections && localErrors.mpmSections[sectionIndex]?.products[productIndex] && (
                    <p
                      id={`mpm-product-id-${sectionIndex}-${productIndex}-error`}
                      style={{
                        fontSize: '0.75rem',
                        color: '#DC2626',
                        marginTop: '4px',
                        fontWeight: '400',
                      }}
                    >
                      {localErrors.mpmSections[sectionIndex].products[productIndex]}
                    </p>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newSections = [...mpmSections];
                  newSections[sectionIndex].productItems.push({ product_retailer_id: '' });
                  setMpmSections(newSections);
                  setTouched('mpmSections');
                }}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #2563EB',
                  borderRadius: '8px',
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  marginTop: '8px',
                }}
                aria-label={`Add product to section ${sectionIndex + 1}`}
              >
                Add Product
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setMpmSections([...mpmSections, { title: '', productItems: [{ product_retailer_id: '' }] }]);
              setTouched('mpmSections');
            }}
            style={{
              padding: '8px 16px',
              border: '1px solid #2563EB',
              borderRadius: '8px',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              marginTop: '8px',
            }}
            aria-label="Add new section"
          >
            Add Section
          </button>
        </div>
      )}
    </div>
  );
};

export default TemplateComponents;