import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../component/sidebar';
import Header from '../../component/header';
import BasicInfo from '../../component/Template/BasicInfo';
import TemplateComponents from '../../component/Template/TemplateComponents';
import Preview from '../../component/Template/Preview';
import ActionButtons from '../../component/Template/ActionButtons';
import useTemplateStore from '../../app/templateStore';

const CreateTemplate = () => {
  const location = useLocation();
  const template = location.state?.template || null;
  const textareaRef = useRef(null);
  const {
    sidebarOpen,
    setSidebarOpen,
    userDropdownOpen,
    setUserDropdownOpen,
    activeNavItem,
    setActiveNavItem,
    templateName,
    language,
    category,
    templateType,
    headerEnabled,
    headerType,
    headerText,
    headerMediaType,
    headerMediaId,
    headerMediaLink,
    headerFile,
    headerLocationLatitude,
    headerLocationLongitude,
    headerLocationName,
    headerLocationAddress,
    bodyText,
    bodyParameters,
    footerEnabled,
    footerText,
    buttonsEnabled,
    buttons,
    flowEnabled,
    flowId,
    flowButtonText,
    flowMessageVersion,
    flowAction,
    flowToken,
    otpButtonType,
    otpExpiry,
    catalogId,
    sampleValues,
    error,
    setHeaderFile,
    setHeaderPreviewUrl,
    setBodyText,
    setBodyParameters,
    setButtons,
    setSampleValues,
    setError,
    setTouched,
    initializeTemplate,
    handleCategoryChange,
    marketingType,
    couponCode,
    limitedTimeOfferText,
    hasExpiration,
    carouselCardCount,
    mpmSections,
    spmProductId,
    catalogThumbnailId,
    reset,
    validateForm,
    getSupportedLanguages,
    parameterFormat,
  } = useTemplateStore();

  const supportedLanguages = getSupportedLanguages();

  // Initialize template if editing
  useEffect(() => {
    if (template) {
      initializeTemplate(template);
    }
  }, [template, initializeTemplate]);

  // Handle category change for template
  useEffect(() => {
    if (template && category) {
      handleCategoryChange(category);
    }
  }, [template, category, handleCategoryChange]);

  // Handle header file preview
  useEffect(() => {
    if (headerFile) {
      const url = URL.createObjectURL(headerFile);
      setHeaderPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setHeaderPreviewUrl(null);
    }
  }, [headerFile, setHeaderPreviewUrl]);

  // Clear errors when key fields change
  useEffect(() => {
    setError('');
  }, [templateName, bodyText, setError]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);
  const handleNavItemClick = (item) => {
    setActiveNavItem(item);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleAddButton = () => {
    if (buttons.length >= 10) {
      setError('Maximum 10 buttons allowed.');  
      return;
    }
    setButtons([
      ...buttons,
      { sub_type: 'quick_reply', index: buttons.length, text: '', parameters: [{ payload: '' }] },
    ]);
    setTouched('buttons', true);
  };

  const handleButtonChange = (index, field, value) => {
    setTouched('buttons', true);
    const newButtons = [...buttons];
    if (field === 'sub_type') {
      newButtons[index] = {
        ...newButtons[index],
        sub_type: value,
        parameters: [
          value === 'url'
            ? { text: '' }
            : value === 'phone_number'
            ? { phone_number: '' }
            : value === 'catalog'
            ? { catalog_id: '' }
            : { payload: '' },
        ],
      };
    } else if (field === 'text') {
      newButtons[index] = { ...newButtons[index], text: value };
    } else if (field === 'parameters') {
      newButtons[index] = {
        ...newButtons[index],
        parameters: value,
      };
    }
    setButtons(newButtons);
  };

  const handleSampleChange = (key, value, type = 'text') => {
    setTouched('sampleValues', true);
    setSampleValues((prev) => {
      if (parameterFormat === 'POSITIONAL') {
        const newSampleValues = [...prev];
        newSampleValues[key] = { type, value };
        return newSampleValues;
      } else {
        let updatedValue = value;
        if (type === 'currency') {
          updatedValue = typeof value === 'object' ? { ...prev[key]?.value, ...value } : value;
        }
        return {
          ...prev,
          [key]: { type, value: updatedValue },
        };
      }
    });
  };

  const handleFileChange = (e) => {
    setTouched('headerFile', true);
    setHeaderFile(e.target.files[0]);
  };

  const handleClear = () => {
    reset();
    setTouched({});
    setError('');
  };

  const handleSubmit = () => {
    // Validate language
    if (!supportedLanguages.find((lang) => lang.code === language)) {
      setError(`Selected language (${language}) is not supported. Please choose a valid language from the dropdown.`);
      setTouched('language', true);
      return;
    }

    // Set all fields as touched to show all errors
    setTouched({
      templateName: true,
      language: true,
      category: true,
      bodyText: true,
      headerText: headerEnabled,
      footerText: footerEnabled,
      buttons: buttonsEnabled,
      flowId: flowEnabled,
      flowButtonText: flowEnabled,
      couponCode: marketingType === 'COUPON',
      limitedTimeOfferText: marketingType === 'LIMITED_TIME_OFFER' && hasExpiration,
      carouselCardCount: ['MEDIA_CAROUSEL', 'PRODUCT_CAROUSEL'].includes(marketingType),
      catalogId: ['CATALOG', 'PRODUCT_CAROUSEL', 'MPM', 'SPM'].includes(marketingType),
      catalogThumbnailId: marketingType === 'CATALOG',
      spmProductId: marketingType === 'SPM',
      headerMediaId: headerEnabled && ['IMAGE', 'VIDEO', 'DOCUMENT'].includes(headerType) && headerMediaType === 'id',
      headerMediaLink: headerEnabled && ['IMAGE', 'VIDEO', 'DOCUMENT'].includes(headerType) && headerMediaType === 'link',
      headerLocationName: headerEnabled && headerType === 'LOCATION',
      headerLocationAddress: headerEnabled && headerType === 'LOCATION',
      headerLocationLatitude: headerEnabled && headerType === 'LOCATION',
      headerLocationLongitude: headerEnabled && headerType === 'LOCATION',
      otpExpiry: templateType === 'AUTHENTICATION',
    });

    const { error: validationError } = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const components = [];

    if (headerEnabled) {
      if (headerType === 'TEXT') {
        components.push({ type: 'header', format: 'TEXT', text: headerText });
      } else if (['IMAGE', 'VIDEO', 'DOCUMENT'].includes(headerType)) {
        components.push({
          type: 'header',
          format: headerType,
          ...(headerMediaId ? { example: { header_handle: [headerMediaId] } } : {}),
          ...(headerMediaLink ? { link: headerMediaLink } : {}),
        });
      } else if (headerType === 'LOCATION') {
        components.push({
          type: 'header',
          format: 'LOCATION',
          location: {
            latitude: headerLocationLatitude,
            longitude: headerLocationLongitude,
            name: headerLocationName,
            address: headerLocationAddress,
          },
        });
      } else if (headerType === 'PRODUCT') {
        components.push({
          type: 'header',
          format: 'PRODUCT',
          catalog_id: catalogId,
        });
      }
    }

    if (bodyText) {
      const bodyComponent = { type: 'body', text: bodyText };
      if (bodyParameters.length > 0) {
        bodyComponent.parameters = bodyParameters.map((param, index) => {
          const key = parameterFormat === 'POSITIONAL' ? index : param.placeholder.replace(/{{|}}/g, '');
          const sample = parameterFormat === 'POSITIONAL' ? sampleValues[index] : sampleValues[key];
          return {
            type: param.type,
            [param.type === 'currency' ? 'currency' : param.type === 'date_time' ? 'date_time' : 'text']:
              param.type === 'currency'
                ? { code: sample?.value?.code || '', amount_1000: sample?.value?.amount_1000 || '' }
                : sample?.value || '',
          };
        });
      }
      components.push(bodyComponent);
    }

    if (footerEnabled) {
      components.push({ type: 'footer', text: footerText });
    }

    if (buttonsEnabled && templateType !== 'AUTHENTICATION') {
      components.push({
        type: 'buttons',
        buttons: buttons.map((button) => ({
          type: button.sub_type,
          text: button.text,
          ...(button.sub_type === 'url' ? { url: button.parameters[0]?.text } : {}),
          ...(button.sub_type === 'phone_number' ? { phone_number: button.parameters[0]?.phone_number } : {}),
          ...(button.sub_type === 'catalog' ? { catalog_id: button.parameters[0]?.catalog_id } : {}),
          ...(button.sub_type === 'quick_reply' || button.sub_type === 'copy_code'
            ? { payload: button.parameters[0]?.payload }
            : {}),
        })),
      });
    }

    if (flowEnabled) {
      components.push({
        type: 'buttons',
        buttons: [
          {
            type: 'flow',
            text: flowButtonText,
            flow_id: flowId,
            flow_action: flowAction,
            navigate_screen: flowAction === 'navigate' ? flowToken : undefined,
            flow_token: flowToken,
            flow_message_version: flowMessageVersion,
          },
        ],
      });
    }

    if (templateType === 'AUTHENTICATION') {
      components.push({
        type: 'buttons',
        buttons: [
          {
            type: otpButtonType.toLowerCase(),
            text: otpButtonType === 'COPY_CODE' ? 'Copy Code' : 'Autofill',
            parameters: [
              {
                type: 'payload',
                payload: otpButtonType === 'COPY_CODE' ? 'copy_code_payload' : 'autofill_payload',
              },
            ],
          },
        ],
      });
    }

    if (marketingType === 'COUPON') {
      components.push({ type: 'coupon_code', code: couponCode });
    }

    if (marketingType === 'LIMITED_TIME_OFFER' && hasExpiration) {
      components.push({ type: 'limited_time_offer', text: limitedTimeOfferText });
    }

    if (['MEDIA_CAROUSEL', 'PRODUCT_CAROUSEL'].includes(marketingType)) {
      components.push({ type: 'carousel', card_count: Number(carouselCardCount) });
    }

    if (marketingType === 'MPM') {
      components.push({
        type: 'product_list',
        catalog_id: catalogId,
        sections: mpmSections,
      });
    }

    if (marketingType === 'SPM') {
      components.push({
        type: 'product',
        catalog_id: catalogId,
        product_retailer_id: spmProductId,
      });
    }

    if (marketingType === 'CATALOG') {
      components.push({
        type: 'catalog',
        catalog_id: catalogId,
        thumbnail_product_retailer_id: catalogThumbnailId,
      });
    }

    const payload = {
      name: templateName,
      language: { policy: 'deterministic', code: language },
      category: category.toLowerCase(),
      parameter_format: parameterFormat === 'POSITIONAL' || templateType === 'AUTHENTICATION' ? 'numbered' : 'named',
      components,
    };

    console.log(template ? 'Updating template:' : 'Creating new template:', JSON.stringify(payload, null, 2));
    alert(`Template submitted successfully in ${supportedLanguages.find((lang) => lang.code === language)?.name || language}!`);
    reset();
    setTouched({});
  };

  const applyFormatting = (format) => {
    if (templateType === 'AUTHENTICATION') {
      setError('Formatting (bold, italic, strikethrough) is not allowed in authentication templates.');
      return;
    }
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = bodyText;
    let newText = text;
    let newCursorPos = end;
    if (start === end) {
      const marker = format === 'bold' ? '**' : format === 'italic' ? '__' : '~~';
      newText = text.substring(0, start) + marker + marker + text.substring(end);
      newCursorPos = start + marker.length;
    } else {
      const selectedText = text.substring(start, end);
      const marker = format === 'bold' ? '*' : format === 'italic' ? '_' : '~';
      newText = text.substring(0, start) + marker + selectedText + marker + text.substring(end);
      newCursorPos = end + marker.length * 2;
    }
    setBodyText(newText);
    setTouched('bodyText', true);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = newCursorPos;
      textarea.focus();
    }, 0);
    const placeholderRegex = parameterFormat === 'POSITIONAL' || templateType === 'AUTHENTICATION'
      ? /{{[0-9]+}}/g
      : /{{[a-z0-9_]+}}/g;
    const placeholders = newText.match(placeholderRegex) || [];
    const newParameters = placeholders.map((placeholder, index) => ({
      type: bodyParameters[index]?.type || 'text',
      placeholder,
    }));
    setBodyParameters(newParameters);
    const newSampleValues = parameterFormat === 'POSITIONAL' || templateType === 'AUTHENTICATION'
      ? placeholders.map((placeholder, index) => sampleValues[index] || { type: 'text', value: '' })
      : placeholders.reduce((acc, placeholder, index) => ({
          ...acc,
          [placeholder.replace(/{{|}}/g, '')]: sampleValues[placeholder.replace(/{{|}}/g, '')] || {
            type: newParameters[index]?.type || 'text',
            value: '',
          },
        }), {});
    setSampleValues(newSampleValues);
  };

  const renderFormattedText = (text) => {
    let formattedText = text;
    const keys = parameterFormat === 'POSITIONAL' || templateType === 'AUTHENTICATION'
      ? bodyParameters.map((_, index) => index)
      : Object.keys(sampleValues);
    keys.forEach((key, index) => {
      const param = parameterFormat === 'POSITIONAL' || templateType === 'AUTHENTICATION'
        ? sampleValues[index]
        : sampleValues[key];
      const placeholder = parameterFormat === 'POSITIONAL' || templateType === 'AUTHENTICATION'
        ? `{{${index + 1}}}`
        : `{{${key}}}`;
      if (param?.type === 'currency') {
        formattedText = formattedText.replace(placeholder, `${param.value?.code || ''} ${param.value?.amount_1000 ? param.value.amount_1000 / 1000 : 0}`);
      } else if (param?.type === 'date_time' || param?.type === 'text') {
        formattedText = formattedText.replace(placeholder, param?.value || placeholder);
      }
    });
    const parts = [];
    let currentIndex = 0;
    const regex = /(\*[^*]+\*|_[^_]+_|~[^~]+~)/g;
    let match;
    while ((match = regex.exec(formattedText)) !== null) {
      if (match.index > currentIndex) {
        parts.push({ type: 'text', content: formattedText.slice(currentIndex, match.index) });
      }
      const matchedText = match[0];
      const content = matchedText.slice(1, -1);
      const type = matchedText.startsWith('*') ? 'bold' : matchedText.startsWith('_') ? 'italic' : 'strikethrough';
      parts.push({ type, content });
      currentIndex = match.index + matchedText.length;
    }
    if (currentIndex < formattedText.length) {
      parts.push({ type: 'text', content: formattedText.slice(currentIndex) });
    }
    // Apply RTL styling for languages like Arabic
    const isRtl = language === 'ar_AR';
    return parts.map((part, index) => {
      const style = isRtl ? { direction: 'rtl', textAlign: 'right' } : {};
      if (part.type === 'bold') {
        return (
          <strong key={index} style={style}>
            {part.content}
          </strong>
        );
      } else if (part.type === 'italic') {
        return (
          <em key={index} style={style}>
            {part.content}
          </em>
        );
      } else if (part.type === 'strikethrough') {
        return (
          <del key={index} style={style}>
            {part.content}
          </del>
        );
      }
      return (
        <span key={index} style={style}>
          {part.content}
        </span>
      );
    });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#dde9f0', overflow: 'hidden' }}>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeNavItem={activeNavItem}
        handleNavItemClick={handleNavItemClick}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header
          activeNavItem={activeNavItem}
          toggleSidebar={toggleSidebar}
          userDropdownOpen={userDropdownOpen}
          toggleUserDropdown={toggleUserDropdown}
        />
        <main style={{ flex: '1', overflowY: 'auto', backgroundColor: '#dde9f0', padding: '32px' }}>
          <div
            style={{
              maxWidth: '896px',
              margin: '0 auto',
              background: 'linear-gradient(145deg, #FFFFFF, #F9FAFB)',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              padding: '32px',
            }}
          >
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                color: '#1F2937',
                marginBottom: '32px',
                letterSpacing: '-0.025em',
              }}
            >
              {template
                ? `Edit WhatsApp Message Template (${supportedLanguages.find((lang) => lang.code === language)?.name || language})`
                : `Create WhatsApp Message Template (${supportedLanguages.find((lang) => lang.code === language)?.name || language})`}
            </h2>
            {error && (
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#DC2626',
                  marginBottom: '16px',
                  fontWeight: '400',
                }}
              >
                {error}
              </p>
            )}
            <BasicInfo />
            <TemplateComponents
              textareaRef={textareaRef}
              applyFormatting={applyFormatting}
              handleSampleChange={handleSampleChange}
              handleFileChange={handleFileChange}
              handleAddButton={handleAddButton}
              handleButtonChange={handleButtonChange}
              headerMediaType={headerMediaType}
              otpExpiry={otpExpiry}
            />
            <Preview renderFormattedText={renderFormattedText} />
            <ActionButtons template={template} handleClear={handleClear} handleSubmit={handleSubmit} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateTemplate;